// app/api/products/route.js
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.trim();

    const where = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { variants: true },
    });

    return Response.json(products.map(normalizeProduct));
  } catch (error) {
    console.error('GET /api/products error:', error);
    return Response.json({ error: 'Không thể tải danh sách sản phẩm' }, { status: 500 });
  }
}

export async function POST(request) {
  const data = await request.json();
  const { variants, ...productData } = data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      // Tạo variants cùng lúc nếu có
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