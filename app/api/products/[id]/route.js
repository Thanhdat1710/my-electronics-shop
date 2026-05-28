import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    
    const product = await prisma.product.findUnique({
      where: { id: id }
    });

    if (!product) {
      return Response.json({ error: 'Không tìm thấy' }, { status: 404 });
    }
    
    return Response.json({
      ...product,
      specs: JSON.parse(product.specs || '[]')
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}