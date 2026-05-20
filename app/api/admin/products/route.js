import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  const data = await request.json();
  const product = await prisma.product.create({ data });
  return Response.json(product);
}