import prisma from "../config/db.js";

// SUPER ADMIN: list all events with club names
export const listEventsForAdmin = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                club: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: { date: "desc" },
        });

        return res.json(events);
    } catch (error) {
        console.error("List events for admin error:", error);
        return res.status(500).json({ message: "Failed to list events", error: error.message });
    }
};

// SUPER ADMIN: update an event
export const updateEventAsAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, type, description, date, startTime, endTime, maxParticipants } = req.body || {};

        const event = await prisma.event.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(type !== undefined && { type }),
                ...(description !== undefined && { description }),
                ...(date !== undefined && { date: new Date(date) }),
                ...(startTime !== undefined && { startTime }),
                ...(endTime !== undefined && { endTime }),
                ...(maxParticipants !== undefined && { maxParticipants: Number(maxParticipants) }),
            },
        });

        return res.json({ message: "Event updated successfully", event });
    } catch (error) {
        console.error("Update event as admin error:", error);
        return res.status(500).json({ message: "Failed to update event", error: error.message });
    }
};

// SUPER ADMIN: delete an event
export const deleteEventAsAdmin = async (req, res) => {
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
        console.error("Delete event as admin error:", error);
        return res.status(500).json({ message: "Failed to delete event", error: error.message });
    }
};
