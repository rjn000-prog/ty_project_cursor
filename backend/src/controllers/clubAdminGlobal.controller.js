// Final fix applied to prisma include for approval email
import prisma from '../config/db.js';
import { sendEmail } from '../utils/mailer.js';
import { generateCertificate } from '../services/pdfService.js';
import { generateQRCode, generateTicketToken } from '../services/qrService.js';
import { normalizeSchema, validateFormData } from "../utils/formSchema.js";
import { analyzeSentiment, summarizeFeedback } from "../services/aiService.js";

export const getGlobalClubAdminDashboard = async (req, res) => {
  try {
    const [clubCount, eventCount, memberCount, registrationCount, recentEvents] =
      await Promise.all([
        prisma.club.count(),
        prisma.event.count(),
        prisma.clubmember.count(),
        prisma.registration.count(),
        prisma.event.findMany({
          take: 6,
          orderBy: { date: "desc" },
          include: { club: true },
        }),
      ]);

    return res.json({
      stats: {
        totalClubs: clubCount,
        totalEvents: eventCount,
        totalClubMembers: memberCount,
        totalEventRegistrations: registrationCount,
      },
      recentEvents: recentEvents.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        date: e.date,
        clubId: e.clubId,
        clubName: e.club?.name,
      })),
    });
  } catch (error) {
    console.error("Global club admin dashboard error:", error);
    return res.status(500).json({
      message: "Failed to load club admin dashboard",
      error: error.message,
    });
  }
};

export const listAllClubsForAdmin = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            clubmember: true,
            event: true,
          },
        },
      },
    });

    return res.json(
      clubs.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        location: c.location,
        contactEmail: c.contactEmail,
        capacity: c.capacity,
        membersCount: c._count.clubmember,
        eventsCount: c._count.event,
      }))
    );
  } catch (error) {
    console.error("List clubs for admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to list clubs", error: error.message });
  }
};

export const getClubForGlobalAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        _count: { select: { clubmember: true, event: true } },
      },
    });

    if (!club) return res.status(404).json({ message: "Club not found" });

    return res.json({
      ...club,
      joinFormSchema: normalizeSchema(club.joinFormSchema),
      membersCount: club._count.clubmember,
      eventsCount: club._count.event,
    });
  } catch (error) {
    console.error("Get club for global admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to load club", error: error.message });
  }
};

export const updateClubAsGlobalAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      name,
      type,
      description,
      presidentName,
      contactEmail,
      capacity,
      location,
    } = req.body || {};

    const updated = await prisma.club.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(description !== undefined && { description }),
        ...(presidentName !== undefined && { presidentName }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(capacity !== undefined && { capacity: Number(capacity) }),
        ...(location !== undefined && { location }),
      },
    });

    return res.json({ message: "Club updated successfully", club: updated });
  } catch (error) {
    console.error("Update club as global admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update club", error: error.message });
  }
};

export const createClubAsGlobalAdmin = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      presidentName,
      contactEmail,
      capacity,
      location,
    } = req.body || {};

    if (!name || !type || !description || !presidentName || !contactEmail || !capacity || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const club = await prisma.club.create({
      data: {
        name,
        type,
        description,
        presidentName,
        contactEmail,
        capacity: Number(capacity),
        location,
      },
    });

    return res.status(201).json({ message: "Club created successfully", club });
  } catch (error) {
    console.error("Create club as global admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create club", error: error.message });
  }
};

export const deleteClubAsGlobalAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const events = await prisma.event.findMany({
      where: { clubId: id },
      select: { id: true },
    });
    const eventIds = events.map((e) => e.id);

    await prisma.$transaction([
      prisma.registration.deleteMany({
        where: eventIds.length ? { eventId: { in: eventIds } } : { id: -1 },
      }),
      prisma.feedback.deleteMany({
        where: eventIds.length ? { eventId: { in: eventIds } } : { studentId: -1, eventId: -1 },
      }),
      prisma.organizer.deleteMany({
        where: eventIds.length ? { eventId: { in: eventIds } } : { id: -1 },
      }),
      prisma.event.deleteMany({ where: { clubId: id } }),
      prisma.clubmember.deleteMany({ where: { clubId: id } }),
      prisma.galleryitem.deleteMany({ where: { clubId: id } }),
      prisma.admin.deleteMany({ where: { clubId: id } }),
      prisma.club.delete({ where: { id } }),
    ]);

    return res.json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Delete club as global admin error:", error);
    return res.status(500).json({
      message: "Failed to delete club",
      error: error.message,
    });
  }
};

export const getClubMembersByClubId = async (req, res) => {
  try {
    const clubId = Number(req.params.id);
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club) return res.status(404).json({ message: "Club not found" });

    const members = await prisma.clubmember.findMany({
      where: { clubId },
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
      orderBy: { id: "desc" },
    });

    return res.json(
      members.map((m) => {
        let extra = {};
        try {
          extra = m.extraData ? JSON.parse(m.extraData) : {};
        } catch (e) {
          console.error("Error parsing extraData for member:", m.id, e);
        }
        return {
          id: m.id,
          role: m.role,
          studentId: m.studentId,
          clubId: m.clubId,
          extraData: extra,
          student: m.student,
        };
      })
    );
  } catch (error) {
    console.error("Get club members by club error:", error);
    return res.status(500).json({
      message: "Failed to load club members",
      error: error.message,
    });
  }
};

export const removeClubMemberById = async (req, res) => {
  try {
    const clubId = Number(req.params.clubId);
    const memberId = Number(req.params.memberId);

    const member = await prisma.clubmember.findUnique({ where: { id: memberId } });
    if (!member || member.clubId !== clubId) {
      return res.status(404).json({ message: "Member not found in this club" });
    }

    await prisma.clubmember.delete({ where: { id: memberId } });
    return res.json({ message: "Member removed" });
  } catch (error) {
    console.error("Remove club member by id error:", error);
    return res
      .status(500)
      .json({ message: "Failed to remove member", error: error.message });
  }
};

export const setClubJoinFormSchema = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const schema = req.body?.schema;
    const normalized = normalizeSchema(schema);

    const updated = await prisma.club.update({
      where: { id },
      data: { joinFormSchema: normalized },
    });

    return res.json({
      message: "Join form updated",
      joinFormSchema: normalizeSchema(updated.joinFormSchema),
    });
  } catch (error) {
    console.error("Set club join form schema error:", error);
    return res.status(500).json({
      message: "Failed to update join form",
      error: error.message,
    });
  }
};

export const listAllEventsForAdmin = async (req, res) => {
  try {
    const clubId = req.query.clubId ? Number(req.query.clubId) : null;

    const events = await prisma.event.findMany({
      where: clubId ? { clubId } : undefined,
      include: {
        club: true,
        _count: { select: { registration: true } },
      },
      orderBy: { date: "desc" },
    });

    return res.json(
      events.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        description: e.description,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        maxParticipants: e.maxParticipants,
        clubId: e.clubId,
        clubName: e.club?.name,
        registrationsCount: e._count.registration,
      }))
    );
  } catch (error) {
    console.error("List events for admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to list events", error: error.message });
  }
};

export const getEventForGlobalAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        club: true,
        _count: { select: { registration: true } },
      },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    return res.json({
      ...event,
      registrationFormSchema: normalizeSchema(event.registrationFormSchema),
      registrationsCount: event._count.registration,
      clubName: event.club?.name,
    });
  } catch (error) {
    console.error("Get event for global admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to load event", error: error.message });
  }
};

export const createEventAsGlobalAdmin = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      date,
      startTime,
      endTime,
      maxParticipants,
      clubId,
    } = req.body || {};

    if (
      !name ||
      !type ||
      !description ||
      !date ||
      !startTime ||
      !endTime ||
      !maxParticipants ||
      !clubId
    ) {
      return res.status(400).json({
        message:
          "name, type, description, date, startTime, endTime, maxParticipants, clubId are required",
      });
    }

    const club = await prisma.club.findUnique({ where: { id: Number(clubId) } });
    if (!club) return res.status(404).json({ message: "Club not found" });

    const event = await prisma.event.create({
      data: {
        name,
        type,
        description,
        date: new Date(date),
        startTime,
        endTime,
        maxParticipants: Number(maxParticipants),
        clubId: Number(clubId),
      },
    });

    return res.status(201).json({ message: "Event created", event });
  } catch (error) {
    console.error("Create event as global admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create event", error: error.message });
  }
};

export const deleteEventAsGlobalAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.$transaction([
      prisma.registration.deleteMany({ where: { eventId: id } }),
      prisma.feedback.deleteMany({ where: { eventId: id } }),
      prisma.organizer.deleteMany({ where: { eventId: id } }),
      prisma.event.delete({ where: { id } }),
    ]);

    return res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event as global admin error:", error);
    return res.status(500).json({
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

export const setEventRegistrationFormSchema = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const schema = req.body?.schema;
    const normalized = normalizeSchema(schema);

    const updated = await prisma.event.update({
      where: { id },
      data: { registrationFormSchema: normalized },
    });

    return res.json({
      message: "Registration form updated",
      registrationFormSchema: normalizeSchema(updated.registrationFormSchema),
    });
  } catch (error) {
    console.error("Set event form schema error:", error);
    return res.status(500).json({
      message: "Failed to update event form",
      error: error.message,
    });
  }
};

export const getEventRegistrationsForAdmin = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const regs = await prisma.registration.findMany({
      where: { eventId },
      include: {
        student: {
          select: { id: true, name: true, email: true, rollNo: true, year: true },
        },
      },
      orderBy: { regDate: "desc" },
    });

    return res.json(
      regs.map((r) => {
        let extra = {};
        try {
          extra = r.extraData ? JSON.parse(r.extraData) : {};
        } catch (e) {
          console.error("Error parsing extraData for registration:", r.id, e);
        }
        return {
          id: r.id,
          status: r.status,
          regDate: r.regDate,
          note: r.note,
          extraData: extra,
          studentId: r.studentId,
          student: r.student,
        };
      })
    );
  } catch (error) {
    console.error("Get event registrations error:", error);
    return res.status(500).json({
      message: "Failed to load registrations",
      error: error.message,
    });
  }
};

export const updateEventRegistrationStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    console.log(`[RegistrationUpdate] ID: ${id}, Status: ${status}`);

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await prisma.registration.update({
      where: { id },
      data: { status },
      include: {
        student: {
          select: { name: true, email: true },
        },
        event: {
          include: { club: true },
        },
      },
    });

    // Send Approval Email if status is APPROVED
    if (status === "APPROVED" && updated.student.email) {
      // Ensure ticketToken exists
      let finalRegistration = updated;
      if (!updated.ticketToken) {
        finalRegistration = await prisma.registration.update({
          where: { id },
          data: { ticketToken: generateTicketToken() },
          include: { student: true, event: { include: { club: true } } }
        });
      }

      await sendEmail({
        to: updated.student.email,
        subject: `Registration Approved: ${updated.event.name} 🎟️`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #059669;">Registration Approved! ✅</h2>
            <p>Hi <b>${updated.student.name}</b>,</p>
            <p>Great news! Your registration for <b>${updated.event.name}</b> has been approved by the admin.</p>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px dashed #cbd5e1; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 0.9rem;">Your Entry Ticket Token:</p>
              <h1 style="margin: 10px 0; color: #1e293b; letter-spacing: 2px; font-family: monospace;">${finalRegistration.ticketToken}</h1>
              <p style="margin: 0; color: #64748b; font-size: 0.8rem;">You can also view your QR code in the "My Events" section of the portal.</p>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p><b>Event Recap:</b></p>
            <ul style="list-style: none; padding: 0;">
              <li>📅 <b>Date:</b> ${new Date(updated.event.date).toLocaleDateString()}</li>
              <li>⏰ <b>Time:</b> ${updated.event.startTime || "TBD"}</li>
              <li>📍 <b>Venue:</b> ${updated.event.club.location || "TBD"}</li>
            </ul>
            <p>Please have your ticket or QR code ready at the entrance. See you there!</p>
            <p style="color: #666; font-size: 0.8rem; margin-top: 30px;">This is an automated message from Event Certificate mail.</p>
          </div>
        `,
      });
    }

    console.log(`[RegistrationUpdate] Success for ID: ${id}`);
    return res.json({ message: `Registration ${status.toLowerCase()}`, registration: updated });
  } catch (error) {
    console.error("Update event registration status error:", error);
    return res.status(500).json({
      message: "Failed to update registration status",
      error: error.message,
    });
  }
};

export const getEventFeedbackForAdmin = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const feedback = await prisma.feedback.findMany({
      where: { eventId },
      include: {
        student: {
          select: { id: true, name: true, email: true, rollNo: true, year: true },
        },
      },
    });

    const sentiment = analyzeSentiment(feedback);
    const summary = summarizeFeedback(feedback);

    return res.json({
      feedback: feedback.map((f) => ({
        rating: f.rating,
        comments: f.comments,
        studentId: f.studentId,
        student: f.student,
      })),
      insights: {
        sentiment,
        summary
      }
    });
  } catch (error) {
    console.error("Get event feedback error:", error);
    return res.status(500).json({
      message: "Failed to load feedback",
      error: error.message,
    });
  }
};

export const getClubAdminAnalytics = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        _count: { select: { clubmember: true, event: true } },
      },
      orderBy: { name: "asc" },
    });

    const registrationsByClub = await prisma.event.findMany({
      select: {
        clubId: true,
        _count: { select: { registration: true } },
      },
    });

    const regMap = new Map();
    for (const row of registrationsByClub) {
      regMap.set(row.clubId, (regMap.get(row.clubId) || 0) + row._count.registration);
    }

    // 4. Registration trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trends = await prisma.registration.groupBy({
      by: ["regDate"],
      where: {
        regDate: { gte: sevenDaysAgo },
      },
      _count: { id: true },
    });

    // Format trends for charting
    const trendMap = new Map();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      trendMap.set(d.toISOString().split("T")[0], 0);
    }

    trends.forEach(t => {
      const dateStr = t.regDate.toISOString().split("T")[0];
      if (trendMap.has(dateStr)) {
        trendMap.set(dateStr, t._count.id);
      }
    });

    const trendData = Array.from(trendMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 5. Member distribution by role
    const memberDist = await prisma.clubmember.groupBy({
      by: ["role"],
      _count: { id: true }
    });

    // 6. Club distribution by type
    const clubDist = await prisma.club.groupBy({
      by: ["type"],
      _count: { id: true }
    });

    // 7. Event distribution by type
    const eventDist = await prisma.event.groupBy({
      by: ["type"],
      _count: { id: true }
    });

    // 8. Top 5 Events by Registration
    const topEventsRaw = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        club: { select: { name: true } },
        _count: { select: { registration: true } }
      },
      orderBy: {
        registration: { _count: 'desc' }
      },
      take: 5
    });

    const topEvents = topEventsRaw.map(e => ({
      name: e.name,
      club: e.club.name,
      registrations: e._count.registration
    }));

    // 9. Summary Counts
    const [totalNews, totalGallery] = await Promise.all([
      prisma.news.count(),
      prisma.galleryitem.count()
    ]);

    return res.json({
      clubs: clubs.map((c) => ({
        clubId: c.id,
        clubName: c.name,
        type: c.type,
        members: c._count.clubmember,
        events: c._count.event,
        registrations: regMap.get(c.id) || 0,
      })),
      trends: trendData,
      memberDistribution: memberDist.map(d => ({ name: d.role, value: d._count.id })),
      clubDistribution: clubDist.map(d => ({ name: d.type, value: d._count.id })),
      eventDistribution: eventDist.map(d => ({ name: d.type, value: d._count.id })),
      topEvents,
      summary: {
        totalNews,
        totalGallery
      }
    });
  } catch (error) {
    console.error("Club admin analytics error:", error);
    return res.status(500).json({
      message: "Failed to load analytics",
      error: error.message,
    });
  }
};

export const issueCertificatesForEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { club: true }
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    const approvedRegs = await prisma.registration.findMany({
      where: { eventId, status: "APPROVED", certIssued: false },
      include: { student: true }
    });

    if (approvedRegs.length === 0) {
      return res.status(400).json({ message: "No pending certificates for approved participants" });
    }

    let successCount = 0;
    for (const reg of approvedRegs) {
      try {
        const pdfBuffer = await generateCertificate({
          registrationId: reg.id,
          studentName: reg.student.name,
          eventName: event.name,
          clubName: event.club.name
        });

        await sendEmail({
          to: reg.student.email,
          subject: `Certificate of Participation: ${event.name} 🎓`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #6366f1;">Congratulations! 🎓</h2>
              <p>Dear <b>${reg.student.name}</b>,</p>
              <p>Thank you for participating in <b>${event.name}</b>. We hope you had a great experience!</p>
              <p>Please find your official <b>Certificate of Participation</b> attached to this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p>Best regards,<br><b>${event.club.name} Team</b></p>
              <p style="color: #666; font-size: 0.8rem; margin-top: 30px;">This is an automated certificate from Event Certificate mail.</p>
            </div>
          `,
          attachments: [
            {
              filename: `Certificate_${event.name.replace(/\s+/g, '_')}.pdf`,
              content: pdfBuffer
            }
          ]
        });

        await prisma.registration.update({
          where: { id: reg.id },
          data: { certIssued: true }
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to issue cert for ${reg.student.email}:`, err);
      }
    }

    return res.json({ message: `Successfully issued ${successCount} certificates` });
  } catch (error) {
    console.error("Issue certificates error:", error);
    return res.status(500).json({ message: "Failed to issue certificates", error: error.message });
  }
};

export const generateRegistrationTicket = async (req, res) => {
  try {
    const regId = Number(req.params.id);
    let reg = await prisma.registration.findUnique({
      where: { id: regId },
      include: { event: true, student: true }
    });

    if (!reg) return res.status(404).json({ message: "Registration not found" });
    if (reg.status !== "APPROVED") {
      return res.status(400).json({ message: "Tickets are only available for approved registrations" });
    }

    if (!reg.ticketToken) {
      const token = generateTicketToken();
      reg = await prisma.registration.update({
        where: { id: regId },
        data: { ticketToken: token },
        include: { event: true, student: true }
      });
    }

    const qrDataUrl = await generateQRCode({
      regId: reg.id,
      token: reg.ticketToken,
      student: reg.student.name,
      event: reg.event.name
    });

    return res.json({
      ticketToken: reg.ticketToken,
      qrCode: qrDataUrl,
      event: reg.event.name,
      student: reg.student.name
    });
  } catch (error) {
    console.error("Generate ticket error:", error);
    return res.status(500).json({ message: "Failed to generate ticket", error: error.message });
  }
};

export const verifyAttendanceByQR = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const reg = await prisma.registration.findUnique({
      where: { ticketToken: token },
      include: { student: true, event: true }
    });

    if (!reg) return res.status(404).json({ message: "Invalid or expired ticket" });
    if (reg.attended) return res.status(400).json({ message: "Attendance already marked", student: reg.student.name });

    await prisma.registration.update({
      where: { id: reg.id },
      data: { attended: true }
    });

    return res.json({
      message: "Attendance marked successfully",
      student: reg.student.name,
      event: reg.event.name
    });
  } catch (error) {
    console.error("Verify attendance error:", error);
    return res.status(500).json({ message: "Failed to verify attendance", error: error.message });
  }
};

export const broadcastToEventParticipants = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registration: {
          where: { status: "APPROVED" },
          include: { student: true },
        },
      },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    const recipients = event.registration
      .map((r) => r.student.email)
      .filter(Boolean);

    if (recipients.length === 0) {
      return res.status(200).json({ message: "No approved participants to broadcast to." });
    }

    // Send emails
    const emailPromises = recipients.map((email) =>
      sendEmail({
        to: email,
        subject: `Update: ${event.name} - ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #6366f1;">Important Update 📣</h2>
            <p>Hi participant,</p>
            <p>The organizers of <b>${event.name}</b> have sent you an update:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; color: #334155; line-height: 1.6;">
              ${message.replace(/\n/g, "<br>")}
            </div>

            <p style="color: #64748b; font-size: 0.9rem;">Please check the portal for further details.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #94a3b8; font-size: 0.8rem;">This is an automated broadcast from Sports Sphere.</p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);

    return res.json({ message: `Broadcast sent successfully to ${recipients.length} participants.` });
  } catch (error) {
    console.error("Broadcast error:", error);
    return res.status(500).json({
      message: "Failed to send broadcast",
      error: error.message,
    });
  }
};
