import prisma from "../../config/db.js";
import { generateCertificate } from "../../services/pdfService.js";
import QRCode from "qrcode";

export const getMyEvents = async (req, res) => {
  try {
    const studentId = Number(req.user.id);

    const registrations = await prisma.registration.findMany({
      where: { studentId },
      include: {
        event: {
          include: { club: true }
        }
      },
      orderBy: { regDate: "desc" }
    });

    const feedbacks = await prisma.feedback.findMany({
      where: { studentId },
      select: { eventId: true }
    });
    const feedbackEventIds = new Set(feedbacks.map(f => f.eventId));

    console.log(`[MyEventsAPI] Sending ${registrations.length} events for student ${studentId}`);

    const events = registrations.map(r => ({
      id: r.event.id,
      registrationId: r.id,
      title: r.event.name,
      date: r.event.date,
      clubName: r.event.club.name,
      venue: r.event.club.location,
      registrationStatus: r.status,
      attended: new Date(r.event.date) < new Date(),
      feedbackSubmitted: feedbackEventIds.has(r.event.id),
      certIssued: r.certIssued
    }));

    res.json(events);
  } catch (error) {
    console.error("getMyEvents error:", error);
    res.status(500).json({ message: "Failed to load your events" });
  }
};

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        department: true,
        registration: {
          include: {
            event: true,
          },
        },
        sportsregistration: {
          include: {
            sport: true,
          },
        },
        teammember: {
          include: {
            team: {
              include: {
                sport: true,
                department: true,
                teammember: {
                  include: {
                    student: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        rollNo: true,
                        year: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const sports = await prisma.sport.findMany({
      include: {
        _count: { select: { team: true } },
      },
      orderBy: { name: "asc" },
    });

    const mySportIds = new Set(
      student.sportsregistration.map((s) => s.sportId)
    );

    const myTeams = student.teammember.map((tm) => tm.team);
    const myTeamIds = myTeams.map((t) => t.id);

    const mySportIdsFromTeams = new Set(myTeams.map((t) => t.sportId));

    const relevantSportIds = Array.from(
      new Set([...mySportIds, ...mySportIdsFromTeams])
    );

    const tournaments = await prisma.tournament.findMany({
      orderBy: { startDate: "desc" },
      include: { sport: true },
    });

    const matches = myTeamIds.length
      ? await prisma.match.findMany({
        where: {
          OR: [{ teamAId: { in: myTeamIds } }, { teamBId: { in: myTeamIds } }],
        },
        include: {
          tournament: { include: { sport: true } },
        },
        orderBy: { date: "desc" },
      })
      : [];

    const matchTeamIds = Array.from(
      new Set(matches.flatMap((m) => [m.teamAId, m.teamBId]))
    );

    const matchTeams = matchTeamIds.length
      ? await prisma.team.findMany({
        where: { id: { in: matchTeamIds } },
        select: { id: true, name: true },
      })
      : [];

    const matchTeamMap = new Map(matchTeams.map((t) => [t.id, t.name]));

    let totalMatches = 0;
    let wins = 0;
    let losses = 0;

    for (const m of matches) {
      totalMatches += 1;
      const isTeamA = myTeamIds.includes(m.teamAId);
      const isTeamB = myTeamIds.includes(m.teamBId);

      if (isTeamA || isTeamB) {
        if (m.scoreA === m.scoreB) continue;
        const weWon =
          (isTeamA && m.scoreA > m.scoreB) ||
          (isTeamB && m.scoreB > m.scoreA);
        if (weWon) wins += 1;
        else losses += 1;
      }
    }

    res.json({
      student: {
        name: student.name,
        email: student.email,
        year: student.year,
        department: student.department.name,
      },
      registrations: student.registration.map((r) => ({
        eventName: r.event.name,
        eventDate: r.event.date,
        status: r.status,
      })),
      sportsRegistrations: student.sportsregistration.map((s) => ({
        id: s.id,
        sportId: s.sportId,
        sportName: s.sport.name,
        status: s.status,
      })),
      sportsOverview: sports.map((s) => ({
        id: s.id,
        name: s.name,
        teamsCount: s._count.team,
        isRegistered: mySportIds.has(s.id),
      })),
      teams: myTeams.map((t) => ({
        id: t.id,
        name: t.name,
        coachName: t.coachName,
        sportName: t.sport.name,
        departmentName: t.department.name,
        members: t.teammember.map((m) => ({
          studentId: m.studentId,
          position: m.position,
          student: m.student,
        })),
      })),
      tournaments: tournaments.map((t) => ({
        id: t.id,
        name: t.name,
        level: t.level,
        startDate: t.startDate,
        endDate: t.endDate,
        sportName: t.sport.name,
      })),
      matches: matches.map((m) => ({
        id: m.id,
        date: m.date,
        venue: m.venue,
        scoreA: m.scoreA,
        scoreB: m.scoreB,
        teamAName: matchTeamMap.get(m.teamAId) || `Team ${m.teamAId}`,
        teamBName: matchTeamMap.get(m.teamBId) || `Team ${m.teamBId}`,
        tournamentName: m.tournament.name,
        sportName: m.tournament.sport.name,
        isUpcoming: m.date > new Date(),
      })),
      performance: {
        totalMatches,
        wins,
        losses,
        certificatesEarned: student.registration.filter(r => r.certIssued).length,
      },
      recommendations: await (async () => {
        const upcomingEvents = await prisma.event.findMany({
          where: {
            date: { gt: new Date() },
            registration: { none: { studentId } }
          },
          include: { club: true, _count: { select: { registration: true } } },
          take: 5
        });

        return upcomingEvents.map(e => ({
          id: e.id,
          title: e.name,
          date: e.date,
          clubName: e.club.name,
          reason: e.club.name.toLowerCase().includes(student.department.name.toLowerCase()) || e.description.toLowerCase().includes(student.department.name.toLowerCase())
            ? `Matches your department (${student.department.name})`
            : "Popular in your college",
          participantCount: e._count.registration,
          maxParticipants: e.maxParticipants
        })).sort((a, b) => (a.reason.includes("Matches") ? -1 : 1));
      })()
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

export const registerForSport = async (req, res) => {
  try {
    const studentId = req.user.id;
    const sportId = Number(req.params.id);

    const existing = await prisma.sportsregistration.findUnique({
      where: {
        studentId_sportId: {
          studentId,
          sportId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "You already registered for this sport",
        registration: existing,
      });
    }

    const reg = await prisma.sportsregistration.create({
      data: {
        studentId,
        sportId,
        status: "pending",
      },
    });

    return res
      .status(201)
      .json({ message: "Registered for sport", registration: reg });
  } catch (error) {
    console.error("registerForSport error:", error);
    return res.status(500).json({
      message: "Failed to register for sport",
      error: error.message,
    });
  }
};

export const getCertificateDownload = async (req, res) => {
  try {
    const regId = Number(req.params.regId);
    const studentId = Number(req.user.id);

    const reg = await prisma.registration.findUnique({
      where: { id: regId },
      include: {
        event: { include: { club: true } },
        student: true,
      },
    });

    if (!reg) {
      return res.status(404).json({ message: "Registration not found" });
    }
    if (reg.studentId !== studentId) {
      return res.status(403).json({ message: "Unauthorized: You do not own this certificate" });
    }
    if (!reg.certIssued) {
      return res.status(400).json({ message: "Certificate has not been issued for this event yet." });
    }

    const pdfBuffer = await generateCertificate({
      registrationId: reg.id,
      studentName: reg.student.name,
      eventName: reg.event.name,
      clubName: reg.event.club.name,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=certificate_${reg.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Certificate download error:", error);
    res.status(500).json({ message: "Failed to generate certificate download" });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const studentId = Number(req.user.id);
    const eventId = Number(req.params.eventId);
    const { rating, comment } = req.body;

    const reg = await prisma.registration.findUnique({
      where: {
        studentId_eventId: { studentId, eventId }
      },
      include: { event: true }
    });

    if (!reg || reg.status !== "APPROVED") {
      return res.status(403).json({ message: "You can only give feedback for events you were approved for." });
    }

    await prisma.feedback.upsert({
      where: {
        studentId_eventId: { studentId, eventId }
      },
      update: {
        rating: Number(rating),
        comments: comment,
      },
      create: {
        studentId,
        eventId,
        rating: Number(rating),
        comments: comment,
        id: Math.floor(Math.random() * 1000000)
      }
    });

    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("submitFeedback error:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

export const getMyTicket = async (req, res) => {
  try {
    const studentId = Number(req.user.id);
    const regId = Number(req.params.regId);

    const reg = await prisma.registration.findUnique({
      where: { id: regId },
      include: {
        event: { include: { club: true } },
        student: true
      }
    });

    if (!reg || reg.studentId !== studentId) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }

    if (!reg.ticketToken) {
      const token = `TKT-${reg.id}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      await prisma.registration.update({
        where: { id: reg.id },
        data: { ticketToken: token }
      });
      reg.ticketToken = token;
    }

    const qrCodeData = await QRCode.toDataURL(reg.ticketToken);

    res.json({
      event: reg.event.name,
      student: reg.student.name,
      ticketToken: reg.ticketToken,
      qrCode: qrCodeData,
      date: reg.event.date,
      venue: reg.event.club.location
    });
  } catch (error) {
    console.error("getMyTicket error:", error);
    res.status(500).json({ message: "Failed to load ticket" });
  }
};
