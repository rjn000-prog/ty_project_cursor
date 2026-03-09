import prisma from "../config/db.js";

// GET ALL EVENTS
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        club: true,
        registration: true
      },
      orderBy: { date: "asc" }
    });

    const formatted = events.map(e => ({
      id: e.id,
      title: e.name,
      description: e.description,
      date: e.date,
      time: e.startTime,
      endTime: e.endTime,
      venue: e.club.location,
      category: e.type,
      clubName: e.club.name,
      maxParticipants: e.maxParticipants,
      participantCount: e.registration.length,
      availableSpots: e.maxParticipants - e.registration.length,
      status: new Date(e.date) < new Date() ? "completed" : "upcoming"
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// CLUB ADMIN / SUPER ADMIN: update event
export const updateEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      name,
      type,
      description,
      date,
      startTime,
      endTime,
      maxParticipants,
    } = req.body || {};

    const data = {
      ...(name !== undefined && { name }),
      ...(type !== undefined && { type }),
      ...(description !== undefined && { description }),
      ...(date !== undefined && { date: new Date(date) }),
      ...(startTime !== undefined && { startTime }),
      ...(endTime !== undefined && { endTime }),
      ...(maxParticipants !== undefined && {
        maxParticipants: Number(maxParticipants),
      }),
    };

    const updated = await prisma.event.update({
      where: { id },
      data,
    });

    return res.json({
      message: "Event updated successfully",
      event: updated,
    });
  } catch (error) {
    console.error("Update event error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update event", error: error.message });
  }
};


// GET EVENT BY ID
export const getEventById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        club: true,
        registration: true
      }
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      id: event.id,
      title: event.name,
      description: event.description,
      date: event.date,
      time: event.startTime,
      endTime: event.endTime,
      venue: event.club.location,
      category: event.type,
      clubName: event.club.name,
      clubId: event.club.id,
      maxParticipants: event.maxParticipants,
      registrationFormSchema: event.registrationFormSchema || [],
      participantCount: event.registration.length,
      availableSpots:
        event.maxParticipants - event.registration.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};