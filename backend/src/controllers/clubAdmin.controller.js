import bcrypt from "bcryptjs";
import prisma from "../config/db.js";

// Helper: get the admin record (for club_admin) and ensure it has a clubId
const getClubAdminWithClub = async (adminId) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    include: { club: true },
  });

  if (!admin || !admin.clubId || !admin.club) {
    throw new Error("Club admin is not associated with any club");
  }

  return admin;
};

// SUPER ADMIN: create a club admin
export const createClubAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, password are required",
      });
    }

    // Ensure requesting user is super_admin (middleware should already enforce, this is just extra safety)
    if (req.user?.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Only super admin can create club admins" });
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "club_admin",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clubId: true,
      },
    });

    return res.status(201).json({
      message: "Club admin created successfully",
      admin,
    });
  } catch (error) {
    console.error("Create club admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create club admin", error: error.message });
  }
};

// SUPER ADMIN: create a sports admin (global sports management)
export const createSportsAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, password are required",
      });
    }

    if (req.user?.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Only super admin can create sports admins" });
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "sports_admin",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(201).json({
      message: "Sports admin created successfully",
      admin,
    });
  } catch (error) {
    console.error("Create sports admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to create sports admin", error: error.message });
  }
};

// CLUB ADMIN: remove a member from their club
export const removeClubMemberForAdmin = async (req, res) => {
  try {
    const admin = await getClubAdminWithClub(Number(req.user.id));
    const clubId = admin.clubId;
    const memberId = Number(req.params.id);

    const member = await prisma.clubmember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.clubId !== clubId) {
      return res
        .status(404)
        .json({ message: "Member not found in your club" });
    }

    await prisma.clubmember.delete({
      where: { id: memberId },
    });

    return res.json({ message: "Member removed from club" });
  } catch (error) {
    console.error("Remove club member for admin error:", error);
    return res.status(500).json({
      message: "Failed to remove member",
      error: error.message,
    });
  }
};

// CLUB ADMIN: dashboard data for their club
export const getClubAdminDashboard = async (req, res) => {
  try {
    const admin = await getClubAdminWithClub(Number(req.user.id));
    const clubId = admin.clubId;

    const now = new Date();

    const [memberCount, eventCount, upcomingEvents] = await Promise.all([
      prisma.clubmember.count({ where: { clubId } }),
      prisma.event.count({ where: { clubId } }),
      prisma.event.findMany({
        where: {
          clubId,
          date: { gte: now },
        },
        orderBy: { date: "asc" },
        take: 5,
      }),
    ]);

    return res.json({
      club: {
        id: admin.club.id,
        name: admin.club.name,
        type: admin.club.type,
        description: admin.club.description,
        location: admin.club.location,
      },
      stats: {
        totalMembers: memberCount,
        totalEvents: eventCount,
      },
      upcomingEvents: upcomingEvents.map((e) => ({
        id: e.id,
        name: e.name,
        date: e.date,
      })),
    });
  } catch (error) {
    console.error("Club admin dashboard error:", error);
    return res.status(500).json({
      message: "Failed to load club admin dashboard",
      error: error.message,
    });
  }
};

// CLUB ADMIN: get their club details
export const getClubForAdmin = async (req, res) => {
  try {
    const admin = await getClubAdminWithClub(Number(req.user.id));

    return res.json({
      id: admin.club.id,
      name: admin.club.name,
      type: admin.club.type,
      description: admin.club.description,
      presidentName: admin.club.presidentName,
      contactEmail: admin.club.contactEmail,
      capacity: admin.club.capacity,
      location: admin.club.location,
    });
  } catch (error) {
    console.error("Get club for admin error:", error);
    return res.status(500).json({
      message: "Failed to load club details",
      error: error.message,
    });
  }
};

// CLUB ADMIN: update their club details
export const updateClubForAdmin = async (req, res) => {
  try {
    const admin = await getClubAdminWithClub(Number(req.user.id));
    const clubId = admin.clubId;

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
      where: { id: clubId },
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

    return res.json({
      message: "Club updated successfully",
      club: updated,
    });
  } catch (error) {
    console.error("Update club for admin error:", error);
    return res.status(500).json({
      message: "Failed to update club details",
      error: error.message,
    });
  }
};

// CLUB ADMIN: list members of their club
export const getClubMembersForAdmin = async (req, res) => {
  try {
    const admin = await getClubAdminWithClub(Number(req.user.id));
    const clubId = admin.clubId;

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
    });

    return res.json(
      members.map((m) => ({
        id: m.id,
        role: m.role,
        studentId: m.studentId,
        student: m.student,
      }))
    );
  } catch (error) {
    console.error("Get club members for admin error:", error);
    return res.status(500).json({
      message: "Failed to load club members",
      error: error.message,
    });
  }
};

// CLUB ADMIN: list events for their club
export const getClubEventsForAdmin = async (req, res) => {
  try {
    const admin = await getClubAdminWithClub(Number(req.user.id));
    const clubId = admin.clubId;

    const events = await prisma.event.findMany({
      where: { clubId },
      orderBy: { date: "desc" },
    });

    return res.json(events);
  } catch (error) {
    console.error("Get club events for admin error:", error);
    return res.status(500).json({
      message: "Failed to load club events",
      error: error.message,
    });
  }
};

// CLUB ADMIN: create event for their club
export const createEventForAdmin = async (req, res) => {
  try {
    const admin = await getClubAdminWithClub(Number(req.user.id));
    const clubId = admin.clubId;

    const {
      name,
      type,
      description,
      date,
      startTime,
      endTime,
      maxParticipants,
    } = req.body || {};

    if (
      !name ||
      !type ||
      !description ||
      !date ||
      !startTime ||
      !endTime ||
      !maxParticipants
    ) {
      return res.status(400).json({
        message:
          "name, type, description, date, startTime, endTime, maxParticipants are required",
      });
    }

    const event = await prisma.event.create({
      data: {
        name,
        type,
        description,
        date: new Date(date),
        startTime,
        endTime,
        maxParticipants: Number(maxParticipants),
        clubId,
      },
    });

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event for admin error:", error);
    return res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
};

