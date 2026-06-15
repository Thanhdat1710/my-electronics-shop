import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();
    const { variants, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: variants && variants.length > 0 ? {
          create: variants.map(v => ({
            storage: v.storage,
            price: parseFloat(v.price),
            oldPrice: v.oldPrice ? parseFloat(v.oldPrice) : null,
            stock: parseInt(v.stock) || 0,
          }))
        } : undefined
      }
    });

    return Response.json(product);
  } catch (error) {
    console.error('POST error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}