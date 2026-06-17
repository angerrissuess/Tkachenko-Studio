import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === '123ewq') {
      const response = NextResponse.json({ success: true });
      
      // Устанавливаем защищенную куку
      response.cookies.set({
        name: 'admin_token',
        value: 'authenticated_123ewq',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        sameSite: 'lax',
      });
      
      return response;
    }

    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
