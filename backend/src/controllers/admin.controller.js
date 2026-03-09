import prisma from "../config/db.js";

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
