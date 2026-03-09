import prisma from "../../config/db.js";

export const getMapEvents = async (req, res) => {
    try {
        const today = new Date();

        // Fetch events from today onwards
        const events = await prisma.event.findMany({
            where: {
                date: { gte: new Date(today.setHours(0, 0, 0, 0)) }
            },
            include: {
                club: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        lat: true,
                        lng: true,
                        type: true
                    }
                }
            },
            orderBy: { date: "asc" }
        });

        const now = new Date();
        const formattedEvents = events.map(e => {
            // Check if event is LIVE
            // Format: "HH:mm – HH:mm"
            const timeParts = e.startTime ? e.startTime.split(':') : [9, 0];
            const eventStart = new Date(e.date);
            eventStart.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));

            const endParts = e.endTime ? e.endTime.split(':') : [12, 0];
            const eventEnd = new Date(e.date);
            eventEnd.setHours(parseInt(endParts[0]), parseInt(endParts[1]));

            const isLive = now >= eventStart && now <= eventEnd;

            return {
                id: e.id,
                title: e.name,
                type: e.type,
                date: e.date,
                startTime: e.startTime,
                endTime: e.endTime,
                club: e.club,
                isLive
            };
        });

        res.json(formattedEvents);
    } catch (error) {
        console.error("getMapEvents error:", error);
        res.status(500).json({ message: "Failed to load map events" });
    }
};
