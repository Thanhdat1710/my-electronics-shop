import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const products = await prisma.product.findMany({
    where: category && category !== 'all' ? { category } : {},
    orderBy: { createdAt: 'desc' }
  });

  return Response.json(products);
}