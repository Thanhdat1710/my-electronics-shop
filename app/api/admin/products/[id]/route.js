import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PUT(request, context) {
  const params = await context.params;
  const data = await request.json();
  const product = await prisma.product.update({
    where: { id: parseInt(params.id) },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      oldPrice: data.oldPrice,
      category: data.category,
      emoji: data.emoji,
      badge: data.badge,
      stock: data.stock,
      images: data.images,
    }
  });
  return Response.json(product);
}

export async function DELETE(request, context) {
  const params = await context.params;
  await prisma.product.delete({ where: { id: parseInt(params.id) } });
  return Response.json({ success: true });
}