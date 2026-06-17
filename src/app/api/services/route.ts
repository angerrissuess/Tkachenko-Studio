import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        services: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить услуги' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, price, description, categoryId, order } = await request.json();
    
    if (!name || price === undefined || !categoryId) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        price: Number(price),
        description: description || null,
        categoryId: Number(categoryId),
        order: order || 0,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Не удалось создать услугу' },
      { status: 500 }
    );
  }
}
