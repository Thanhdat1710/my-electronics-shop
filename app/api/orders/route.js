import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  const { userId, items, address, phone, total } = await request.json();

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      address,
      phone,
      items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: { items: true }
  });

  return Response.json(order);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const orders = await prisma.order.findMany({
    where: { userId: parseInt(userId) },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return Response.json(orders);
}