import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { name, price, description } = await request.json();
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const updated = await prisma.service.update({
      where: { id },
      data: { name, price: Number(price), description },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обновления услуги' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления услуги' }, { status: 500 });
  }
}
