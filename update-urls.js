const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const newUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
    await prisma.video.updateMany({
        data: { url: newUrl }
    });
    console.log("Updated all video URLs to a working sample.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
