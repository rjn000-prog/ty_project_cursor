import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('12345678', 10);

    const studentData = [
        { email: 'razaknadaf04@gmail.com', name: 'Razak Nadaf', rollNo: 'TY04' },
        { email: 'razaknadaf31@gmail.com', name: 'Razak Nadaf', rollNo: 'TY31' },
        { email: 'awdeshgoud07@gmail.com', name: 'Awdesh Goud', rollNo: 'TY07' },
        { email: 'nikeshyadav1315@gmail.com', name: 'Nikesh Yadav', rollNo: 'TY1315' },
        { email: 'student5@example.com', name: 'Suresh Kumar', rollNo: 'TY05' },
        { email: 'student6@example.com', name: 'Ramesh Singh', rollNo: 'TY06' },
        { email: 'student7@example.com', name: 'Anita Patil', rollNo: 'TY07A' },
        { email: 'student8@example.com', name: 'Priya Sharma', rollNo: 'TY08' },
        { email: 'student9@example.com', name: 'Rahul Verma', rollNo: 'TY09' },
    ];

    console.log('Seeding students...');
    for (const s of studentData) {
        await prisma.student.upsert({
            where: { email: s.email },
            update: { password },
            create: {
                ...s,
                password,
                dob: new Date('2002-01-01'),
                address: 'Test Hostel',
                mobile: '9999999999',
                year: 3,
                departmentId: 1
            }
        });
        console.log(`- ${s.email}`);
    }

    console.log('Moving events to past for testing...');
    // Event IDs from screenshot: 1, 3
    await prisma.event.updateMany({
        where: { id: { in: [1, 3] } },
        data: { date: new Date('2024-02-20T10:00:00Z') }
    });

    console.log('Cleaning up registrations for test students to allow fresh testing...');
    for (const s of studentData) {
        const student = await prisma.student.findUnique({ where: { email: s.email } });
        if (student) {
            await prisma.registration.deleteMany({
                where: { studentId: student.id }
            });
        }
    }

    console.log('Done! You can now log in with these emails and password "12345678".');
    console.log('The events "Rap Battle Night" and "Morning Yoga Session" are now in the past and these students are registered+approved.');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
