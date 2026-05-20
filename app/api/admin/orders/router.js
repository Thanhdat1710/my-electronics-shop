import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' }
  });
  return Response.json(orders);
}