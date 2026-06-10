// app/api/products/[id]/route.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PUT(request, context) {
  const params = await context.params;
  const data = await request.json();
  const { variants, ...productData } = data;
  const productId = parseInt(params.id);

  // Xóa variants cũ rồi tạo lại — đơn giản và chắc chắn nhất
  await prisma.productVariant.deleteMany({ where: { productId } });

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      name:        productData.name,
      description: productData.description,
      price:       productData.price,
      oldPrice:    productData.oldPrice,
      category:    productData.category,
      emoji:       productData.emoji,
      badge:       productData.badge,
      stock:       productData.stock,
      images:      productData.images,
      specs:       productData.specs,
      // Tạo variants mới nếu có
      variants: variants && variants.length > 0 ? {
        create: variants.map(v => ({
          storage:  v.storage,
          price:    parseFloat(v.price),
          oldPrice: v.oldPrice ? parseFloat(v.oldPrice) : null,
          stock:    parseInt(v.stock) || 0,
        }))
      } : undefined,
    },
    include: { variants: true },
  });

  return Response.json(product);
}

export async function DELETE(request, context) {
  const params = await context.params;
  // variants tự xóa theo nhờ onDelete: Cascade
  await prisma.product.delete({ where: { id: parseInt(params.id) } });
  return Response.json({ success: true });
}