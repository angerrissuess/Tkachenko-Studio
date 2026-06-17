import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, order } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Название категории обязательно' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9а-яё]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || 'category-' + Date.now(),
        order: order || 0,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Не удалось создать категорию' },
      { status: 500 }
    );
  }
}
