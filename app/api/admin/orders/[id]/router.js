import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PATCH(request, context) {
  const params = await context.params;
  const { status } = await request.json();
  const order = await prisma.order.update({
    where: { id: parseInt(params.id) },
    data: { status }
  });
  return Response.json(order);
}