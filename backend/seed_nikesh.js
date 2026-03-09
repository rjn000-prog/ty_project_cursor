import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const email = 'nikeshyadav1315@gmail.com';
    const student = await prisma.student.findUnique({
        where: { email },
    });

    if (!student) {
        console.log(`Student with email ${email} not found.`);
        return;
    }

    console.log(`Found student: ${student.name} (ID: ${student.id})`);

    // Find or create a past event
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);

    let pastEvent = await prisma.event.findFirst({
        where: { date: { lt: new Date() } }
    });

    if (!pastEvent) {
        console.log("No past event found, creating one...");
        const club = await prisma.club.findFirst();
        if (!club) {
            console.log("No club found to attach event to.");
            return;
        }
        pastEvent = await prisma.event.create({
            data: {
                name: 'Past Championship 2024',
                type: 'Sports',
                description: 'A great tournament that already happened.',
                date: pastDate,
                startTime: '10:00 AM',
                endTime: '05:00 PM',
                maxParticipants: 100,
                clubId: club.id,
            }
        });
    }

    console.log(`Using past event: ${pastEvent.name} (ID: ${pastEvent.id})`);

    // Create registration
    try {
        const reg = await prisma.registration.upsert({
            where: {
                studentId_eventId: {
                    studentId: student.id,
                    eventId: pastEvent.id,
                }
            },
            update: {
                status: 'APPROVED',
                attended: true,
                certIssued: true,
            },
            create: {
                studentId: student.id,
                eventId: pastEvent.id,
                status: 'APPROVED',
                attended: true,
                certIssued: true,
            }
        });
        console.log(`Successfully added/updated registration for ${student.name} to event ${pastEvent.name}`);
    } catch (error) {
        console.error("Error seeding registration:", error);
    }

    // Add some sports counts too
    const sport = await prisma.sport.findFirst();
    if (sport) {
        await prisma.sportsregistration.upsert({
            where: {
                studentId_sportId: {
                    studentId: student.id,
                    sportId: sport.id
                }
            },
            update: { status: 'APPROVED' },
            create: {
                studentId: student.id,
                sportId: sport.id,
                status: 'APPROVED'
            }
        });
        console.log(`Successfully added sport registration for ${sport.name}`);
    }

    await prisma.$disconnect();
}

main();
