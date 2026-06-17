import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, serviceId, date, time, comment } = body;

    // Validation
    if (!name || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля: имя, телефон, дата, время' },
        { status: 400 }
      );
    }

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,18}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Некорректный формат телефона' },
        { status: 400 }
      );
    }

    const sanitize = (str: string | null) => str ? str.replace(/</g, '&lt;').replace(/>/g, '&gt;') : null;

    const appointment = await prisma.appointment.create({
      data: {
        name: sanitize(name) as string,
        phone,
        email: sanitize(email),
        serviceId: serviceId ? parseInt(serviceId) : null,
        date: new Date(date),
        time,
        comment: sanitize(comment),
        status: 'pending',
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Не удалось создать запись' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить записи' },
      { status: 500 }
    );
  }
}
