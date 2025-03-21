// prisma/seed.ts (CommonJS version)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.blogPost.create({
    data: {
      title: 'Welcome to SME',
      slug: 'welcome-to-sme',
      content: 'This is a test post.',
      publishedAt: new Date(),
      status: 'published',
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
