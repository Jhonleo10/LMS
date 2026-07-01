import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SAMPLE_VIDEOS = [
  {
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript in this comprehensive intro course.",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://picsum.photos/seed/video1/640/360",
    category: "Development",
    order: 1,
  },
  {
    title: "React Fundamentals",
    description: "Master React components, hooks, and state management for modern web apps.",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://picsum.photos/seed/video2/640/360",
    category: "Development",
    order: 2,
  },
  {
    title: "UI/UX Design Principles",
    description: "Discover the core principles of user interface and experience design.",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://picsum.photos/seed/video3/640/360",
    category: "Design",
    order: 3,
  },
  {
    title: "Data Science Basics",
    description: "An introduction to data analysis, visualization, and machine learning concepts.",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://picsum.photos/seed/video4/640/360",
    category: "Data Science",
    order: 4,
  },
  {
    title: "Project Management Essentials",
    description: "Learn agile methodologies and effective team collaboration strategies.",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://picsum.photos/seed/video5/640/360",
    category: "Business",
    order: 5,
  },
  {
    title: "Cloud Computing Overview",
    description: "Explore AWS, Azure, and GCP fundamentals for scalable applications.",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://picsum.photos/seed/video6/640/360",
    category: "Infrastructure",
    order: 6,
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ENABLED",
    },
  });

  const learnerPassword = await bcrypt.hash("learner123", 12);
  await prisma.user.upsert({
    where: { email: "learner@example.com" },
    update: {},
    create: {
      name: "Demo Learner",
      email: "learner@example.com",
      password: learnerPassword,
      role: "LEARNER",
      status: "ENABLED",
    },
  });

  for (const video of SAMPLE_VIDEOS) {
    const existing = await prisma.video.findFirst({
      where: { title: video.title },
    });
    if (!existing) {
      const { order, ...rest } = video;
      await prisma.video.create({
        data: { ...rest, sortOrder: order, published: true },
      });
    } else if (!existing.published) {
      await prisma.video.update({
        where: { id: existing.id },
        data: { published: true },
      });
    }
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
