// app/api/products/[id]/route.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function normalizeProduct(product) {
  let specs = product.specs;

  if (typeof specs === 'string') {
    try {
      specs = JSON.parse(specs);
    } catch {
      specs = [];
    }
  }

  return {
    ...product,
    specs: Array.isArray(specs) ? specs : [],
  };
}

export async function GET(request, context) {
  const params = await context.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: { variants: true }, // ← trả về variants cho trang chi tiết
  });
  if (!product) return Response.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
  return Response.json(normalizeProduct(product));
}