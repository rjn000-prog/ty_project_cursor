import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const items = [
        {
            title: "Goa University Taekwondo Achievement",
            caption: "Recognizing excellence in martial arts at the university level.",
            imageUrl: "/gallery/taekwondo_achievement.png", // Assume user places image here
            visible: true
        },
        {
            title: "Annual Sports Prize Distribution",
            caption: "Celebrating our athletes' hard work and dedication during the prize ceremony.",
            imageUrl: "/gallery/prize_distribution.png", // Assume user places image here
            visible: true
        }
    ];

    for (const item of items) {
        await prisma.galleryitem.create({
            data: item
        });
    }

    console.log("✅ Successfully added 2 new gallery items.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
