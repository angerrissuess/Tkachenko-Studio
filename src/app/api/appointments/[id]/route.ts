import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { status } = await request.json();
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обновления записи' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления записи' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { name, phone, date, time, serviceIds } = body;
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(serviceIds && { services: { set: [], connect: serviceIds.map((sid: any) => ({ id: Number(sid) })) } })
      },
      include: {
        services: {
          include: { category: true }
        }
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка редактирования записи' }, { status: 500 });
  }
}
