import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

export async function POST(request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return Response.json({ error: 'Email không tồn tại' }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return Response.json({ error: 'Sai mật khẩu' }, { status: 401 });

  return Response.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}