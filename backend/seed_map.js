import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const clubs = await prisma.club.findMany();
    console.log(`Found ${clubs.length} clubs.`);

    for (const club of clubs) {
        let lat, lng;
        if (club.name.toLowerCase().includes('taekwondo')) {
            lat = 115; lng = 280; // Gym Hall
        } else if (club.name.toLowerCase().includes('beatbox')) {
            lat = 105; lng = 530; // Music Room
        } else if (club.name.toLowerCase().includes('basket')) {
            lat = 505; lng = 185; // Basketball Ground
        } else if (club.name.toLowerCase().includes('tire') || club.name.toLowerCase().includes('cycling')) {
            lat = 405; lng = 245; // Volleyball Ground (Using as proxy for Sports Ground)
        } else if (club.name.toLowerCase().includes('rapper')) {
            lat = 115; lng = 665; // Upper Audi
        } else if (club.name.toLowerCase().includes('yoga')) {
            lat = 530; lng = 185; // Near Basketball/Sports
        } else {
            lat = 225; lng = 400; // Default Main Block
        }

        await prisma.club.update({
            where: { id: club.id },
            data: { lat, lng }
        });
        console.log(`Updated ${club.name} to (${lng}, ${lat})`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
