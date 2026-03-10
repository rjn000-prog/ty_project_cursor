import prisma from "../config/db.js";
import { generateProjectReport } from "../services/pdfService.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      eventCount,
      clubCount,
      registrationCount,
      sportCount,
      recentEvents,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.club.count(),
      prisma.registration.count(),
      prisma.sport.count(),
      prisma.event.findMany({
        take: 5,
        orderBy: { date: "desc" },
        include: { club: true },
      }),
    ]);

    res.json({
      totalEvents: eventCount,
      totalClubs: clubCount,
      totalRegistrations: registrationCount,
      totalSports: sportCount,
      recentEvents: recentEvents.map((e) => ({
        id: e.id,
        name: e.name,
        date: e.date,
        clubName: e.club?.name,
      })),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

export const getProjectReport = async (req, res) => {
  try {
    const [
      totalClubs,
      totalEvents,
      totalStudents,
      totalRegistrations,
      totalSports,
      totalTournaments,
      totalTeams,
      totalNews,
      clubs,
      events,
      sports,
      tournaments,
      registrationSummary,
      studentsByYear,
    ] = await Promise.all([
      prisma.club.count(),
      prisma.event.count(),
      prisma.student.count(),
      prisma.registration.count(),
      prisma.sport.count(),
      prisma.tournament.count(),
      prisma.team.count(),
      prisma.news.count(),
      prisma.club.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { clubmember: true, event: true } } },
      }),
      prisma.event.findMany({
        orderBy: { date: "desc" },
        include: {
          club: { select: { name: true } },
          _count: { select: { registration: true } },
        },
      }),
      prisma.sport.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { team: true, tournament: true } } },
      }),
      prisma.tournament.findMany({
        orderBy: { startDate: "desc" },
        include: { sport: { select: { name: true } } },
      }),
      prisma.registration.groupBy({ by: ["status"], _count: true }),
      prisma.student.groupBy({ by: ["year"], _count: true, orderBy: { year: "asc" } }),
    ]);

    const reportData = {
      stats: {
        totalClubs,
        totalEvents,
        totalStudents,
        totalRegistrations,
        totalSports,
        totalTournaments,
        totalTeams,
        totalNews,
      },
      clubs,
      events,
      sports,
      tournaments,
      registrationSummary,
      studentStats: { byYear: studentsByYear },
    };

    const pdfBuffer = await generateProjectReport(reportData);

    const filename = `Sports_Sphere_Project_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Project report error:", error);
    res.status(500).json({ message: "Failed to generate project report" });
  }
};
