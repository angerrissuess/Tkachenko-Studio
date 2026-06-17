'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  unit: string | null;
  categoryId: number;
  image: string | null;
  order: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  services: Service[];
}

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
  source: string;
}

/* ═══════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════ */
function Header({ onOpenBooking }: { onOpenBooking: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__inner">
          <a href="#" className="header__logo">
            TKACHENKO<span>STUDIO</span>
          </a>
          <nav className="header__nav">
            <button className="header__link" onClick={() => handleNavClick('services')}>Услуги</button>
            <button className="header__link" onClick={() => handleNavClick('portfolio')}>Портфолио</button>
            <button className="header__link" onClick={() => handleNavClick('reviews')}>Отзывы</button>
            <button className="header__link" onClick={() => handleNavClick('map')}>Контакты</button>
            <button className="header__cta" onClick={onOpenBooking}>Записаться</button>
          </nav>
          <button className={`header__burger ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Меню">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
      <div className={`mobile-nav ${mobileOpen ? 'active' : ''}`}>
        <button className="mobile-nav__link" onClick={() => handleNavClick('services')}>Услуги</button>
        <button className="mobile-nav__link" onClick={() => handleNavClick('portfolio')}>Портфолио</button>
        <button className="mobile-nav__link" onClick={() => handleNavClick('reviews')}>Отзывы</button>
        <button className="mobile-nav__link" onClick={() => handleNavClick('map')}>Контакты</button>
        <button className="mobile-nav__link" onClick={() => { setMobileOpen(false); onOpenBooking(); }}>Записаться</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */
function Hero({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <section className="hero" id="hero">
      <div className="hero__content">
        <p className="hero__label">Студия красоты в Краснодаре</p>
        <h1 className="hero__title">Tkachenko Studio</h1>
        <p className="hero__subtitle">
          Премиальная студия сложного окрашивания и ухода за волосами. 
          Работаем на материалах Keune (Нидерланды).
        </p>
        <div className="hero__buttons">
          <button className="btn btn--primary" onClick={onOpenBooking}>
            Записаться на приём
          </button>
          <button className="btn btn--outline" onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}>
            Наши работы
          </button>
        </div>
        <div className="hero__rating">
          <span className="hero__stars">★★★★★</span>
          <span className="hero__rating-text">5.0 — 133 оценки на Яндекс Картах</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════ */
function Services({ categories }: { categories: Category[] }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredServices = activeTab === 'all'
    ? categories.flatMap(c => c.services.map(s => ({ ...s, categoryName: c.name })))
    : categories.find(c => c.slug === activeTab)?.services.map(s => ({ ...s, categoryName: categories.find(c2 => c2.slug === activeTab)?.name || '' })) || [];

  return (
    <section className="section services section--light" id="services">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Наши услуги</span>
          <h2 className="section-title">Услуги и цены</h2>
          <div className="divider"></div>
          <p className="section-subtitle">Индивидуальный подход к каждому клиенту с использованием материалов премиум качества</p>
        </div>

        <div className="services__tabs" style={{ marginBottom: '32px' }}>
          <button className={`services__tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Все</button>
          {categories.map(cat => (
            <button key={cat.id} className={`services__tab ${activeTab === cat.slug ? 'active' : ''}`} onClick={() => setActiveTab(cat.slug)}>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="services__grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card">
              <h3 className="service-card__name">{service.name}</h3>
              {service.description && (
                <p className="service-card__description">{service.description}</p>
              )}
              <div className="service-card__footer">
                <div>
                  <div className="service-card__price">
                    {service.price.toLocaleString('ru-RU')} <span>₽</span>
                  </div>
                  {service.unit && <div className="service-card__unit">{service.unit}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PORTFOLIO
   ═══════════════════════════════════════════ */
function Portfolio() {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const portfolioItems = [
    { id: 1, title: 'Сложное окрашивание', category: 'Окрашивание', image: 'https://avatars.mds.yandex.net/get-altay/226077/2a0000018d12ca28e8b4160e87b37fc9d811/orig' },
    { id: 2, title: 'Уход и тонирование', category: 'Окрашивание', image: 'https://avatars.mds.yandex.net/get-altay/10648814/2a0000018ac213d758ab5917f7ce3dcf985e/orig' },
    { id: 3, title: 'Блонд без желтизны', category: 'Окрашивание', image: 'https://avatars.mds.yandex.net/get-altay/10142335/2a0000018a65907f9c5d7685fc7880ea56df/orig' },
    { id: 4, title: 'Стрижка каскад', category: 'Стрижки', image: 'https://avatars.mds.yandex.net/get-altay/10814540/2a0000018d32988efd692c6e207e9cfe9dcf/orig' },
    { id: 5, title: 'Восстановление Keune', category: 'Уход', image: 'https://avatars.mds.yandex.net/get-altay/10141118/2a0000018a6590751bad4413aea3fb21ef3d/orig' },
    { id: 6, title: 'Вшивание седины', category: 'Окрашивание', image: 'https://avatars.mds.yandex.net/get-altay/754546/2a0000018d5ff07c85c5b6c5ca22b2675221/orig' },
    { id: 7, title: 'Тонирование', category: 'Окрашивание', image: 'https://avatars.mds.yandex.net/get-altay/11400795/2a0000018d5ff07256702c9f63821785f2d0/orig' },
    { id: 8, title: 'AirTouch', category: 'Окрашивание', image: 'https://avatars.mds.yandex.net/get-altay/9849468/2a0000018a6590ae0433b8d01dc83044f1ff/orig' },
  ];

  const heights = [320, 240, 280, 260, 300, 220];

  return (
    <section className="section portfolio" id="portfolio">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Портфолио</span>
          <h2 className="section-title">Примеры работ</h2>
          <div className="divider"></div>
          <p className="section-subtitle">Каждая работа — это индивидуальный подход и внимание к деталям</p>
        </div>

        <div className="portfolio__grid">
          {portfolioItems.map((item) => (
            <div key={item.id} className="portfolio__item" onClick={() => setLightboxImg(item.image)}>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="portfolio__overlay">
                <div>
                  <div className="portfolio__overlay-title">{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>{item.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxImg && (
        <div className="lightbox active" onClick={() => setLightboxImg(null)}>
          <button className="lightbox__close" onClick={() => setLightboxImg(null)}>✕</button>
          <img src={lightboxImg} alt="Portfolio item" className="lightbox__image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════
   REVIEWS
   ═══════════════════════════════════════════ */
function Reviews({ reviews }: { reviews: Review[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 400;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  return (
    <section className="section reviews" id="reviews">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Отзывы клиентов</span>
          <h2 className="section-title">Нам доверяют</h2>
          <div className="divider"></div>
          <p className="section-subtitle">Рейтинг 5.0 из 5.0 на Яндекс Картах — 133 оценки от реальных клиентов</p>
        </div>

        <div className="reviews__wrapper">
          <div className="reviews__carousel" ref={carouselRef}>
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__avatar">
                    {review.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="review-card__author">{review.author}</div>
                    <div className="review-card__date" suppressHydrationWarning>{formatDate(review.date)}</div>
                  </div>
                </div>
                <div className="review-card__stars">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className="review-card__text">{review.text}</p>
              </div>
            ))}
          </div>

          <div className="reviews__controls">
            <button className="reviews__arrow" onClick={() => scroll('left')} aria-label="Назад">←</button>
            <button className="reviews__arrow" onClick={() => scroll('right')} aria-label="Вперёд">→</button>
          </div>

          <a href="https://yandex.ru/maps/org/tkachenko_studio/195936187575/reviews/" target="_blank" rel="noopener noreferrer" className="reviews__link">
            Все отзывы на Яндекс Картах →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MAP
   ═══════════════════════════════════════════ */
function MapSection() {
  return (
    <section className="section map-section" id="map">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Контакты</span>
          <h2 className="section-title">Как добраться</h2>
          <div className="divider"></div>
        </div>

        <div className="map__grid">
          <div className="map__info">
            <div className="map__detail">
              <div className="map__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div className="map__detail-content">
                <h4>Адрес</h4>
                <p>г. Краснодар, ул. Таманская, 130/3</p>
              </div>
            </div>

            <div className="map__detail">
              <div className="map__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div className="map__detail-content">
                <h4>Телефон</h4>
                <p><a href="tel:+79673138893">+7 (967) 313-88-93</a></p>
              </div>
            </div>

            <div className="map__detail">
              <div className="map__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div className="map__detail-content">
                <h4>Часы работы</h4>
                <p>Ежедневно: 09:30 — 18:30</p>
              </div>
            </div>

            <div className="map__detail">
              <div className="map__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div className="map__detail-content">
                <h4>Мессенджеры</h4>
                <p>
                  <a href="https://wa.me/79673138893" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  {' · '}
                  <a href="https://t.me/tkachenko_studio" target="_blank" rel="noopener noreferrer">Telegram</a>
                </p>
              </div>
            </div>

            <div className="map__socials">
              <a href="https://wa.me/79673138893" target="_blank" rel="noopener noreferrer" className="map__social-link" title="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
              <a href="https://t.me/tkachenko_studio" target="_blank" rel="noopener noreferrer" className="map__social-link" title="Telegram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </a>
              <a href="https://vk.com/tkachenko.yulia_colorist" target="_blank" rel="noopener noreferrer" className="map__social-link" title="VKontakte" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                VK
              </a>
            </div>

            <a
              href="https://yandex.ru/maps/org/tkachenko_studio/195936187575/?ll=39.015162,45.019411&z=17"
              target="_blank"
              rel="noopener noreferrer"
              className="map__route-btn"
            >
              Построить маршрут →
            </a>
          </div>

          <div className="map__iframe-container">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=39.015162%2C45.019411&mode=search&oid=195936187575&ol=biz&z=17"
              allowFullScreen
              title="Tkachenko Studio на карте"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   BOOKING FORM
   ═══════════════════════════════════════════ */
function BookingModal({ services, isOpen, onClose }: { services: Service[], isOpen: boolean, onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', serviceIds: [] as number[], date: '', time: '', comment: '',
  });

  const handleServiceChange = (id: number) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id) 
        ? prev.serviceIds.filter(sId => sId !== id) 
        : [...prev.serviceIds, id]
    }));
  };
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (val: string) => {
    const nums = val.replace(/\D/g, '').substring(0, 11);
    if (!nums) return '';
    if (nums.length <= 1) return '+7 (';
    let res = '+7 (' + nums.substring(1, 4);
    if (nums.length >= 5) res += ') ' + nums.substring(4, 7);
    if (nums.length >= 8) res += '-' + nums.substring(7, 9);
    if (nums.length >= 10) res += '-' + nums.substring(9, 11);
    return res;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: formatPhone(e.target.value) });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length < 18) {
      setToast('Введите корректный номер телефона');
      return;
    }
    if (formData.email && !validateEmail(formData.email)) {
      setToast('Введите корректный email (например, test@gmail.com)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setToast('✓ Вы успешно записаны!');
        setFormData({ name: '', phone: '', email: '', serviceIds: [], date: '', time: '', comment: '' });
        setTimeout(() => onClose(), 2000);
      } else {
        const data = await res.json();
        setToast(data.error || 'Ошибка при записи');
      }
    } catch {
      setToast('Ошибка соединения');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(''), 4000);
    }
  };

  return (
    <div className={`booking-modal ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="booking-modal__content" onClick={e => e.stopPropagation()}>
        <button className="booking-modal__close" onClick={onClose}>✕</button>
        <h2 className="booking-modal__title">Записаться на приём</h2>
        <p className="booking-modal__desc">Оставьте заявку и мы свяжемся с вами для подтверждения</p>

        <form onSubmit={handleSubmit}>
          <div className="booking__grid">
            <div className="booking__field">
              <label className="booking__label">Имя *</label>
              <input className="booking__input" type="text" name="name" placeholder="Ваше имя" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="booking__field">
              <label className="booking__label">Телефон *</label>
              <input
                type="tel"
                required
                placeholder="+7 (___) ___-__-__"
                className="booking__input"
                value={formData.phone}
                onChange={handlePhoneChange}
              />
            </div>
            <div className="booking__field">
              <label className="booking__label">Email</label>
              <input className="booking__input" type="email" name="email" placeholder="Ваш email (необязательно)" value={formData.email} onChange={handleChange} />
            </div>
            <div className="booking__field full-width">
              <label className="booking__label">Выберите услуги</label>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {services.map(s => (
                  <label key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      style={{ marginTop: '2px', width: '18px', height: '18px', accentColor: '#000', cursor: 'pointer' }}
                      checked={formData.serviceIds.includes(s.id)}
                      onChange={() => handleServiceChange(s.id)}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 500, color: '#1e293b', fontSize: '15px' }}>{s.name}</span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>{s.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="booking__field">
              <label className="booking__label">Дата *</label>
              <input className="booking__input" type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="booking__field">
              <label className="booking__label">Время *</label>
              <input className="booking__input" type="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>
            <div className="booking__field full-width">
              <label className="booking__label">Комментарий</label>
              <textarea className="booking__textarea" name="comment" placeholder="Дополнительные пожелания..." value={formData.comment} onChange={handleChange}></textarea>
            </div>
            <div className="booking__submit">
              <button className="btn btn--primary" type="submit" disabled={loading}>
                {loading ? 'Отправка...' : 'Записаться'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toast && <div className={`toast ${toast ? 'active' : ''}`}>{toast}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">TKACHENKO STUDIO</div>
            <p className="footer__brand-desc">
              Премиальная студия сложного окрашивания и ухода за волосами в Краснодаре. Мастер-колорист Юлия Ткаченко.
            </p>
          </div>
          <div>
            <div className="footer__heading">Навигация</div>
            <a href="#services" className="footer__link">Услуги</a>
            <a href="#portfolio" className="footer__link">Портфолио</a>
            <a href="#reviews" className="footer__link">Отзывы</a>
            <a href="#map" className="footer__link">Контакты</a>
          </div>
          <div>
            <div className="footer__heading">Услуги</div>
            <a href="#services" className="footer__link">Окрашивание</a>
            <a href="#services" className="footer__link">Стрижки</a>
            <a href="#services" className="footer__link">Уход</a>
            <a href="#services" className="footer__link">Продукция</a>
          </div>
          <div>
            <div className="footer__heading">Контакты</div>
            <a href="tel:+79673138893" className="footer__link">+7 (967) 313-88-93</a>
            <a href="https://wa.me/79673138893" className="footer__link" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="https://t.me/tkachenko_studio" className="footer__link" target="_blank" rel="noopener noreferrer">Telegram</a>
            <span className="footer__link">Ежедневно 09:30—18:30</span>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright" suppressHydrationWarning>© {new Date().getFullYear()} Tkachenko Studio. Все права защищены.</p>
          <div className="footer__social">
            <a href="https://wa.me/79673138893" target="_blank" rel="noopener noreferrer" className="footer__social-icon" title="WhatsApp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            <a href="https://t.me/tkachenko_studio" target="_blank" rel="noopener noreferrer" className="footer__social-icon" title="Telegram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </a>
            <a href="https://vk.com/tkachenko.yulia_colorist" target="_blank" rel="noopener noreferrer" className="footer__social-icon" title="VK">VK</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   SCROLL ANIMATION HOOK
   ═══════════════════════════════════════════ */
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useScrollAnimations();

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then((data: Category[]) => {
        setCategories(data);
        setAllServices(data.flatMap(c => c.services));
      })
      .catch(console.error);

    fetch('/api/reviews')
      .then(res => res.json())
      .then(setReviews)
      .catch(console.error);
  }, []);

  return (
    <>
      <Header onOpenBooking={() => setIsBookingOpen(true)} />
      <main>
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
        <Services categories={categories} />
        <Portfolio />
        <Reviews reviews={reviews} />
        <MapSection />
      </main>
      <Footer />
      <BookingModal 
        services={allServices} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}
