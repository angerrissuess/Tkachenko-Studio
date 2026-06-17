import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.review.deleteMany();
  await prisma.portfolioItem.deleteMany();

  // Create categories
  const coloring = await prisma.category.create({
    data: { name: 'Окрашивание', slug: 'coloring', description: 'Сложные техники окрашивания волос', order: 1 },
  });
  const haircuts = await prisma.category.create({
    data: { name: 'Стрижки', slug: 'haircuts', description: 'Женские стрижки любой сложности', order: 2 },
  });
  const care = await prisma.category.create({
    data: { name: 'Уход', slug: 'care', description: 'Спа-процедуры и восстановление волос', order: 3 },
  });
  const products = await prisma.category.create({
    data: { name: 'Продукция Keune', slug: 'products', description: 'Профессиональная косметика для волос', order: 4 },
  });

  // Create services
  await prisma.service.createMany({
    data: [
      // Coloring
      {
        name: 'Окрашивание Airtouch',
        description: 'При помощи сложного окрашивания этим методом, возможно добиться любого рисунка на волосах, подобрать ваш индивидуальный оттенок, а также встроить седину в окрашивание',
        price: 12000,
        unit: '15 см',
        categoryId: coloring.id,
        order: 1,
      },
      {
        name: 'Шитьё седины на короткие волосы',
        description: 'Профессиональное вшивание седины в окрашивание на коротких волосах',
        price: 12000,
        unit: '30 см',
        categoryId: coloring.id,
        order: 2,
      },
      {
        name: 'Выход из чёрного / тёмного',
        description: 'Избавление от темного или черного косметического пигмента с сохранением качества волос',
        price: 10000,
        unit: '1 шт.',
        categoryId: coloring.id,
        order: 3,
      },
      {
        name: 'Окрашивание волос тон в тон',
        description: 'Окрашивание седины тон в тон подбором индивидуальных решений',
        price: 5000,
        unit: '1 шт.',
        categoryId: coloring.id,
        order: 4,
      },
      {
        name: 'Тонирование',
        description: 'При помощи тонирования можно легко создавать модные оттенки на светлых волосах от песочных, карамельных до перламутровых и жемчужных оттенков',
        price: 3000,
        unit: '1 шт.',
        categoryId: coloring.id,
        order: 5,
      },
      // Haircuts
      {
        name: 'Стрижка каскад на длинные волосы',
        description: 'Стрижка каскад добавляет объёма плотным и тяжёлым волосам',
        price: 2500,
        unit: '1 шт.',
        categoryId: haircuts.id,
        order: 1,
      },
      {
        name: 'Стрижка кончиков машинкой',
        description: 'Стрижка кончиков машинкой — это идеально ровный срез, для любительниц плотности и ухоженности на концах. Подходит для гладких волос одной длины',
        price: 1100,
        unit: '1 шт.',
        categoryId: haircuts.id,
        order: 2,
      },
      {
        name: 'Стрижка чёлки (шторка)',
        description: 'Удлинённая чёлка-шторка придаёт образу лёгкость и романтику',
        price: 800,
        unit: '1 шт.',
        categoryId: haircuts.id,
        order: 3,
      },
      // Care
      {
        name: 'Спа уход',
        description: 'Профессиональный спа-уход для восстановления и питания волос',
        price: 4000,
        unit: '1 шт.',
        categoryId: care.id,
        order: 1,
      },
      {
        name: 'Восстановление (лечение) волос',
        description: 'Уход-реконструкция на длинные волосы выполняется на материалах премиум качества бренда Keune (Нидерланды). В результате ухода волосы становятся плотными, крепкими и блестящими',
        price: 3000,
        unit: '1 шт.',
        categoryId: care.id,
        order: 2,
      },
      // Products
      {
        name: 'Шампунь для окрашенных волос Keune',
        description: 'Профессиональный шампунь для поддержания цвета окрашенных волос',
        price: 2200,
        unit: '300 мл',
        categoryId: products.id,
        order: 1,
      },
      {
        name: 'Маска Кератиновый комплекс',
        description: 'Интенсивная маска с кератиновым комплексом для глубокого восстановления',
        price: 3400,
        unit: '200 мл',
        categoryId: products.id,
        order: 2,
      },
      {
        name: 'Маска для волос Питательная',
        description: 'Питательная маска для сухих и повреждённых волос',
        price: 3200,
        unit: '200 мл',
        categoryId: products.id,
        order: 3,
      },
      {
        name: 'Спрей для волос Шёлковый уход',
        description: 'Несмываемый спрей для гладкости и блеска волос',
        price: 3200,
        unit: '140 мл',
        categoryId: products.id,
        order: 4,
      },
      {
        name: 'Шампунь Питательный',
        description: 'Питательный шампунь для ежедневного ухода за волосами',
        price: 2200,
        unit: '250 мл',
        categoryId: products.id,
        order: 5,
      },
    ],
  });

  // Create reviews
  await prisma.review.createMany({
    data: [
      {
        author: 'Анна Кузнецова',
        rating: 5,
        text: 'Юлия — настоящий профессионал! Делала Airtouch, результат просто потрясающий. Цвет получился именно такой, как я хотела. Волосы после окрашивания в отличном состоянии, мягкие и блестящие. Однозначно рекомендую!',
        date: new Date('2026-05-15'),
        source: 'yandex',
      },
      {
        author: 'Мария Соколова',
        rating: 5,
        text: 'Хожу к Юлии уже больше года. Выход из чёрного цвета прошёл безболезненно для волос — это просто чудо! Теперь красивый натуральный оттенок. Спасибо за профессионализм и внимательный подход!',
        date: new Date('2026-05-02'),
        source: 'yandex',
      },
      {
        author: 'Екатерина Волкова',
        rating: 5,
        text: 'Лучшая студия в Краснодаре! Делала сложное окрашивание — результат превзошёл все ожидания. Атмосфера уютная, угостили вкусным кофе. Юлия подробно объяснила, как ухаживать за волосами дома. Купила шампунь Keune — волосы как после салона!',
        date: new Date('2026-04-20'),
        source: 'yandex',
      },
      {
        author: 'Ольга Петрова',
        rating: 5,
        text: 'Пришла на стрижку каскад и тонирование. Юлия подобрала идеальный оттенок — нежный перламутровый. Стрижка добавила объёма, волосы теперь выглядят совсем по-другому. Очень довольна!',
        date: new Date('2026-04-08'),
        source: 'yandex',
      },
      {
        author: 'Дарья Иванова',
        rating: 5,
        text: 'Записалась на восстановление волос после неудачного окрашивания в другом салоне. Юлия провела уход на средствах Keune — волосы ожили буквально за одну процедуру! Теперь хожу только сюда.',
        date: new Date('2026-03-25'),
        source: 'yandex',
      },
      {
        author: 'Наталья Смирнова',
        rating: 5,
        text: 'Делала вшивание седины — результат невероятный! Седина полностью встроена в окрашивание, переход абсолютно натуральный. Юлия настоящий мастер своего дела. Рекомендую всем!',
        date: new Date('2026-03-10'),
        source: 'yandex',
      },
      {
        author: 'Алина Козлова',
        rating: 5,
        text: 'Впервые попробовала спа-уход для волос — это что-то невероятное! Волосы стали шелковистыми и послушными. А ещё очень понравился спрей «Шёлковый уход» Keune — пользуюсь каждый день!',
        date: new Date('2026-02-28'),
        source: 'yandex',
      },
      {
        author: 'Виктория Лебедева',
        rating: 5,
        text: 'Стрижка чёлки-шторки — это моя лучшая идея в этом году! Юлия подобрала форму идеально под овал лица. Образ стал более романтичным и свежим. Обязательно вернусь!',
        date: new Date('2026-02-14'),
        source: 'yandex',
      },
      {
        author: 'Светлана Морозова',
        rating: 5,
        text: 'Окрашивание тон в тон — быстро, качественно, красиво. Седина полностью закрыта, цвет натуральный. Юлия работает очень аккуратно, внимательна к деталям. Студия чистая и уютная.',
        date: new Date('2026-01-30'),
        source: 'yandex',
      },
      {
        author: 'Полина Новикова',
        rating: 5,
        text: 'Ходила на Airtouch к Валерии — результат шикарный! Видно, что Юлия отлично обучает своих мастеров. Цвет держится уже 2 месяца, корни отрастают незаметно. Спасибо большое!',
        date: new Date('2026-01-15'),
        source: 'yandex',
      },
      {
        author: 'Ирина Фёдорова',
        rating: 5,
        text: 'Купила маску «Кератиновый комплекс» Keune по совету Юлии. Волосы после неё как после салонного ухода! Теперь вся моя семья пользуется продукцией из этой студии. Качество на высоте!',
        date: new Date('2025-12-20'),
        source: 'yandex',
      },
      {
        author: 'Татьяна Белова',
        rating: 5,
        text: 'Делала стрижку кончиков машинкой — срез идеально ровный, волосы выглядят здоровыми и ухоженными. Быстро, аккуратно и недорого. Теперь хожу раз в месяц поддерживать форму.',
        date: new Date('2025-12-05'),
        source: 'yandex',
      },
    ],
  });

  // Create portfolio items
  await prisma.portfolioItem.createMany({
    data: [
      {
        title: 'Airtouch на длинные волосы',
        description: 'Сложное окрашивание с плавным переходом от тёмных корней к светлым концам',
        category: 'coloring',
        image: '/portfolio/airtouch-1.jpg',
        order: 1,
      },
      {
        title: 'Выход из чёрного цвета',
        description: 'Бережное осветление с сохранением качества волос',
        category: 'coloring',
        image: '/portfolio/exit-black-1.jpg',
        order: 2,
      },
      {
        title: 'Тонирование в жемчужный оттенок',
        description: 'Нежный перламутровый оттенок на светлых волосах',
        category: 'coloring',
        image: '/portfolio/toning-1.jpg',
        order: 3,
      },
      {
        title: 'Стрижка каскад',
        description: 'Объёмная многослойная стрижка для длинных волос',
        category: 'haircuts',
        image: '/portfolio/cascade-1.jpg',
        order: 4,
      },
      {
        title: 'Восстановление волос Keune',
        description: 'Результат после спа-ухода и реконструкции',
        category: 'care',
        image: '/portfolio/care-1.jpg',
        order: 5,
      },
      {
        title: 'Вшивание седины',
        description: 'Натуральное встраивание седины в окрашивание',
        category: 'coloring',
        image: '/portfolio/gray-blend-1.jpg',
        order: 6,
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log('   - 4 categories');
  console.log('   - 15 services');
  console.log('   - 12 reviews');
  console.log('   - 6 portfolio items');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
