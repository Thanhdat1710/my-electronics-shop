import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function DELETE(request, context) {
  const params = await context.params;
  await prisma.product.delete({ where: { id: parseInt(params.id) } });
  return Response.json({ success: true });
}