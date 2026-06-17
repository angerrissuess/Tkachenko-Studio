import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить отзывы' },
      { status: 500 }
    );
  }
}
