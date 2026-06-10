const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    take: 30,
    orderBy: { id: 'asc' },
  });

  for (const p of products) {
    console.log(`ID=${p.id} CATEGORY=${p.category} VARIANTS=${p.variants.length} NAME=${p.name}`);
    if (p.variants.length) {
      console.log('  STORAGE=' + p.variants.map(v => v.storage).join(','));
    }
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
