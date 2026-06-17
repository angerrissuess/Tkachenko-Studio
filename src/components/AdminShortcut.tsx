'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminShortcut() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A (Windows/Linux) or Cmd + Shift + A (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault();
        setIsOpen(true);
        setPassword('');
        setError('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsOpen(false);
        router.push('/admin');
      } else {
        setError('Неверный пароль');
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-auth-modal" onClick={() => setIsOpen(false)}>
      <div className="admin-auth-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-heading)', color: 'var(--white)' }}>Вход в CRM</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Пароль"
            className="booking__input"
            style={{ width: '100%', marginBottom: '16px', background: 'var(--dark-gray)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)' }}
          />
          {error && <div style={{ color: '#ff4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn--primary" style={{ flex: 1, padding: '10px' }} disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
            <button type="button" className="btn btn--outline" style={{ padding: '10px' }} onClick={() => setIsOpen(false)}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
