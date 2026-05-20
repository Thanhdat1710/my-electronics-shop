import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

export async function POST(request) {
  const { name, email, password } = await request.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return Response.json({ error: 'Email đã tồn tại' }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  });

  return Response.json({ id: user.id, name: user.name, email: user.email });
}