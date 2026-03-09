import prisma from "../config/db.js";

export const getSportsAdminDashboard = async (req, res) => {
  try {
    const [
      sportCount,
      teamCount,
      tournamentCount,
      matchCount,
      sportsRegistrationCount,
      pendingRegistrationsCount,
      recentTournaments,
    ] = await Promise.all([
      prisma.sport.count(),
      prisma.team.count(),
      prisma.tournament.count(),
      prisma.match.count(),
      prisma.sportsregistration.count(),
      prisma.sportsregistration.count({ where: { status: "pending" } }),
      prisma.tournament.findMany({
        take: 5,
        orderBy: { startDate: "desc" },
        include: { sport: true },
      }),
    ]);

    return res.json({
      totalSports: sportCount,
      totalTeams: teamCount,
      totalTournaments: tournamentCount,
      totalMatches: matchCount,
      totalSportsRegistrations: sportsRegistrationCount,
      pendingSportsRegistrations: pendingRegistrationsCount,
      recentTournaments: recentTournaments.map((t) => ({
        id: t.id,
        name: t.name,
        level: t.level,
        startDate: t.startDate,
        endDate: t.endDate,
        sportName: t.sport?.name,
      })),
    });
  } catch (error) {
    console.error("Sports admin dashboard error:", error);
    return res.status(500).json({
      message: "Failed to load sports dashboard",
      error: error.message,
    });
  }
};

export const getSportsAnalytics = async (req, res) => {
  try {
    const sports = await prisma.sport.findMany({
      include: {
        _count: {
          select: {
            team: true,
            tournament: true,
            sportsregistration: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const matchesBySport = await prisma.match.findMany({
      select: {
        tournament: {
          select: {
            sportId: true,
          },
        },
      },
    });

    const matchCountBySport = new Map();
    for (const m of matchesBySport) {
      const sportId = m.tournament.sportId;
      matchCountBySport.set(
        sportId,
        (matchCountBySport.get(sportId) || 0) + 1
      );
    }

    return res.json({
      sports: sports.map((s) => ({
        id: s.id,
        name: s.name,
        teams: s._count.team,
        tournaments: s._count.tournament,
        registrations: s._count.sportsregistration,
        matches: matchCountBySport.get(s.id) || 0,
      })),
    });
  } catch (error) {
    console.error("Sports analytics error:", error);
    return res.status(500).json({
      message: "Failed to load sports analytics",
      error: error.message,
    });
  }
};

export const listSports = async (req, res) => {
  try {
    const sports = await prisma.sport.findMany({
      include: {
        _count: { select: { team: true, tournament: true, sportsregistration: true } },
      },
      orderBy: { name: "asc" },
    });

    return res.json(
      sports.map((s) => ({
        id: s.id,
        name: s.name,
        teamsCount: s._count.team,
        tournamentsCount: s._count.tournament,
        registrationsCount: s._count.sportsregistration,
      }))
    );
  } catch (error) {
    console.error("List sports error:", error);
    return res
      .status(500)
      .json({ message: "Failed to list sports", error: error.message });
  }
};

export const createSport = async (req, res) => {
  try {
    const { name } = req.body || {};

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const existing = await prisma.sport.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: "Sport with this name already exists" });
    }

    const sport = await prisma.sport.create({
      data: { name },
    });

    return res.status(201).json({ message: "Sport created", sport });
  } catch (error) {
    console.error("Create sport error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create sport", error: error.message });
  }
};

export const updateSport = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body || {};

    const sport = await prisma.sport.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
      },
    });

    return res.json({ message: "Sport updated", sport });
  } catch (error) {
    console.error("Update sport error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update sport", error: error.message });
  }
};

export const deleteSport = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const sport = await prisma.sport.findUnique({
      where: { id },
      include: {
        _count: { select: { team: true, tournament: true, sportsregistration: true } },
      },
    });

    if (!sport) {
      return res.status(404).json({ message: "Sport not found" });
    }

    if (
      sport._count.team > 0 ||
      sport._count.tournament > 0 ||
      sport._count.sportsregistration > 0
    ) {
      return res.status(400).json({
        message:
          "Cannot delete sport with existing teams, tournaments, or registrations. Please clear them first.",
      });
    }

    await prisma.sport.delete({ where: { id } });

    return res.json({ message: "Sport deleted" });
  } catch (error) {
    console.error("Delete sport error:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete sport", error: error.message });
  }
};

export const listTeams = async (req, res) => {
  try {
    const sportId = req.query.sportId ? Number(req.query.sportId) : null;

    const teams = await prisma.team.findMany({
      where: sportId ? { sportId } : undefined,
      include: {
        sport: true,
        department: true,
        teammember: {
          include: {
            student: {
              select: { id: true, name: true, email: true, rollNo: true, year: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return res.json(
      teams.map((t) => ({
        id: t.id,
        name: t.name,
        coachName: t.coachName,
        sportId: t.sportId,
        sportName: t.sport.name,
        departmentId: t.departmentId,
        departmentName: t.department.name,
        members: t.teammember.map((m) => ({
          studentId: m.studentId,
          position: m.position,
          student: m.student,
        })),
      }))
    );
  } catch (error) {
    console.error("List teams error:", error);
    return res
      .status(500)
      .json({ message: "Failed to list teams", error: error.message });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { name, coachName, departmentId, sportId } = req.body || {};

    if (!name || !coachName || !departmentId || !sportId) {
      return res.status(400).json({
        message: "name, coachName, departmentId, sportId are required",
      });
    }

    const team = await prisma.team.create({
      data: {
        name,
        coachName,
        departmentId: Number(departmentId),
        sportId: Number(sportId),
      },
    });

    return res.status(201).json({ message: "Team created", team });
  } catch (error) {
    console.error("Create team error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create team", error: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, coachName, departmentId } = req.body || {};

    const team = await prisma.team.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(coachName !== undefined && { coachName }),
        ...(departmentId !== undefined && { departmentId: Number(departmentId) }),
      },
    });

    return res.json({ message: "Team updated", team });
  } catch (error) {
    console.error("Update team error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update team", error: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.$transaction([
      prisma.teammember.deleteMany({ where: { teamId: id } }),
      prisma.match.deleteMany({
        where: { OR: [{ teamAId: id }, { teamBId: id }] },
      }),
      prisma.team.delete({ where: { id } }),
    ]);

    return res.json({ message: "Team deleted" });
  } catch (error) {
    console.error("Delete team error:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete team", error: error.message });
  }
};

export const addPlayerToTeam = async (req, res) => {
  try {
    const teamId = Number(req.params.id);
    const { studentId, position } = req.body || {};

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    await prisma.teammember.create({
      data: {
        teamId,
        studentId: Number(studentId),
        position: position || "player",
      },
    });

    return res.status(201).json({ message: "Player added to team" });
  } catch (error) {
    console.error("Add player to team error:", error);
    return res.status(500).json({
      message: "Failed to add player to team",
      error: error.message,
    });
  }
};

export const removePlayerFromTeam = async (req, res) => {
  try {
    const teamId = Number(req.params.teamId);
    const studentId = Number(req.params.studentId);

    await prisma.teammember.delete({
      where: {
        studentId_teamId: {
          studentId,
          teamId,
        },
      },
    });

    return res.json({ message: "Player removed from team" });
  } catch (error) {
    console.error("Remove player from team error:", error);
    return res.status(500).json({
      message: "Failed to remove player from team",
      error: error.message,
    });
  }
};

export const listTournaments = async (req, res) => {
  try {
    const sportId = req.query.sportId ? Number(req.query.sportId) : null;

    const tournaments = await prisma.tournament.findMany({
      where: sportId ? { sportId } : undefined,
      include: {
        sport: true,
        _count: { select: { match: true } },
      },
      orderBy: { startDate: "desc" },
    });

    return res.json(
      tournaments.map((t) => ({
        id: t.id,
        name: t.name,
        level: t.level,
        startDate: t.startDate,
        endDate: t.endDate,
        sportId: t.sportId,
        sportName: t.sport.name,
        matchesCount: t._count.match,
      }))
    );
  } catch (error) {
    console.error("List tournaments error:", error);
    return res.status(500).json({
      message: "Failed to list tournaments",
      error: error.message,
    });
  }
};

export const createTournament = async (req, res) => {
  try {
    const { name, level, startDate, endDate, sportId } = req.body || {};

    if (!name || !level || !startDate || !endDate || !sportId) {
      return res.status(400).json({
        message: "name, level, startDate, endDate, sportId are required",
      });
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        level,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        sportId: Number(sportId),
      },
    });

    return res.status(201).json({ message: "Tournament created", tournament });
  } catch (error) {
    console.error("Create tournament error:", error);
    return res.status(500).json({
      message: "Failed to create tournament",
      error: error.message,
    });
  }
};

export const updateTournament = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, level, startDate, endDate } = req.body || {};

    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(level !== undefined && { level }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
      },
    });

    return res.json({ message: "Tournament updated", tournament });
  } catch (error) {
    console.error("Update tournament error:", error);
    return res.status(500).json({
      message: "Failed to update tournament",
      error: error.message,
    });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.$transaction([
      prisma.match.deleteMany({ where: { tournamentId: id } }),
      prisma.tournament.delete({ where: { id } }),
    ]);

    return res.json({ message: "Tournament deleted" });
  } catch (error) {
    console.error("Delete tournament error:", error);
    return res.status(500).json({
      message: "Failed to delete tournament",
      error: error.message,
    });
  }
};

export const listMatches = async (req, res) => {
  try {
    const tournamentId = req.query.tournamentId
      ? Number(req.query.tournamentId)
      : null;

    const matches = await prisma.match.findMany({
      where: tournamentId ? { tournamentId } : undefined,
      include: {
        tournament: { include: { sport: true } },
      },
      orderBy: { date: "desc" },
    });

    const teamIds = Array.from(
      new Set(matches.flatMap((m) => [m.teamAId, m.teamBId]))
    );

    const teams = teamIds.length
      ? await prisma.team.findMany({
          where: { id: { in: teamIds } },
          select: { id: true, name: true },
        })
      : [];

    const teamMap = new Map(teams.map((t) => [t.id, t.name]));

    return res.json(
      matches.map((m) => ({
        id: m.id,
        date: m.date,
        venue: m.venue,
        scoreA: m.scoreA,
        scoreB: m.scoreB,
        teamAId: m.teamAId,
        teamAName: teamMap.get(m.teamAId) || `Team ${m.teamAId}`,
        teamBId: m.teamBId,
        teamBName: teamMap.get(m.teamBId) || `Team ${m.teamBId}`,
        tournamentId: m.tournamentId,
        tournamentName: m.tournament.name,
        sportName: m.tournament.sport.name,
      }))
    );
  } catch (error) {
    console.error("List matches error:", error);
    return res.status(500).json({
      message: "Failed to list matches",
      error: error.message,
    });
  }
};

export const createMatch = async (req, res) => {
  try {
    const { date, venue, scoreA, scoreB, teamAId, teamBId, tournamentId } =
      req.body || {};

    if (!date || !venue || !teamAId || !teamBId || !tournamentId) {
      return res.status(400).json({
        message: "date, venue, teamAId, teamBId, tournamentId are required",
      });
    }

    const match = await prisma.match.create({
      data: {
        date: new Date(date),
        venue,
        scoreA: scoreA !== undefined ? Number(scoreA) : 0,
        scoreB: scoreB !== undefined ? Number(scoreB) : 0,
        teamAId: Number(teamAId),
        teamBId: Number(teamBId),
        tournamentId: Number(tournamentId),
      },
    });

    return res.status(201).json({ message: "Match created", match });
  } catch (error) {
    console.error("Create match error:", error);
    return res.status(500).json({
      message: "Failed to create match",
      error: error.message,
    });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { date, venue, scoreA, scoreB } = req.body || {};

    const match = await prisma.match.update({
      where: { id },
      data: {
        ...(date !== undefined && { date: new Date(date) }),
        ...(venue !== undefined && { venue }),
        ...(scoreA !== undefined && { scoreA: Number(scoreA) }),
        ...(scoreB !== undefined && { scoreB: Number(scoreB) }),
      },
    });

    return res.json({ message: "Match updated", match });
  } catch (error) {
    console.error("Update match error:", error);
    return res.status(500).json({
      message: "Failed to update match",
      error: error.message,
    });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.match.delete({ where: { id } });
    return res.json({ message: "Match deleted" });
  } catch (error) {
    console.error("Delete match error:", error);
    return res.status(500).json({
      message: "Failed to delete match",
      error: error.message,
    });
  }
};

export const listSportsRegistrations = async (req, res) => {
  try {
    const sportId = req.query.sportId ? Number(req.query.sportId) : null;

    const regs = await prisma.sportsregistration.findMany({
      where: sportId ? { sportId } : undefined,
      include: {
        sport: true,
        student: {
          select: { id: true, name: true, email: true, rollNo: true, year: true },
        },
      },
      orderBy: { id: "desc" },
    });

    return res.json(
      regs.map((r) => ({
        id: r.id,
        status: r.status,
        sportId: r.sportId,
        sportName: r.sport.name,
        studentId: r.studentId,
        student: r.student,
      }))
    );
  } catch (error) {
    console.error("List sports registrations error:", error);
    return res.status(500).json({
      message: "Failed to list sports registrations",
      error: error.message,
    });
  }
};

export const updateSportsRegistrationStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "status must be one of: pending, approved, rejected",
      });
    }

    const reg = await prisma.sportsregistration.update({
      where: { id },
      data: { status },
    });

    return res.json({ message: "Registration updated", registration: reg });
  } catch (error) {
    console.error("Update sports registration status error:", error);
    return res.status(500).json({
      message: "Failed to update sports registration",
      error: error.message,
    });
  }
};
