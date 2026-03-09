import prisma from "../config/db.js";

// SUPER ADMIN: list all clubs with their primary admin email (if any)
export const listClubsWithAdmins = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        admins: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const result = clubs.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      location: c.location,
      contactEmail: c.contactEmail,
      admin: c.admins.find((a) => a.role === "club_admin") || null,
    }));

    return res.json(result);
  } catch (error) {
    console.error("List clubs with admins error:", error);
    return res
      .status(500)
      .json({ message: "Failed to list clubs", error: error.message });
  }
};

// SUPER ADMIN: create a club
export const createClubWithAdmin = async (req, res) => {
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

    if (
      !name ||
      !type ||
      !description ||
      !presidentName ||
      !contactEmail ||
      !capacity ||
      !location
    ) {
      return res.status(400).json({
        message:
          "name, type, description, presidentName, contactEmail, capacity, location are required",
      });
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

    return res.status(201).json({
      message: "Club created successfully",
      club,
    });
  } catch (error) {
    console.error("Create club with admin error:", error);
    return res.status(500).json({
      message: "Failed to create club",
      error: error.message,
    });
  }
};

// SUPER ADMIN: update a club
export const updateClubAsAdmin = async (req, res) => {
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

    const club = await prisma.club.update({
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

    return res.json({
      message: "Club updated successfully",
      club,
    });
  } catch (error) {
    console.error("Update club as admin error:", error);
    return res.status(500).json({
      message: "Failed to update club",
      error: error.message,
    });
  }
};

// SUPER ADMIN: delete a club
export const deleteClubAsAdmin = async (req, res) => {
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
    console.error("Delete club as admin error:", error);
    return res.status(500).json({
      message: "Failed to delete club",
      error: error.message,
    });
  }
};

