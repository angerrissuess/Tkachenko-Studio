'use client';

import { useState, useEffect } from 'react';

// Types
interface Appointment {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  comment: string | null;
  status: string;
  createdAt: string;
  service: {
    name: string;
    price: number;
    category: { name: string };
  } | null;
}

interface Service {
  id: number;
  name: string;
  price: number;
  description: string | null;
}

interface Category {
  id: number;
  name: string;
  services: Service[];
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'services'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Appointments State
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Services Edit State
  const [editingService, setEditingService] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0 });

  // Add Category/Service State
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [showAddService, setShowAddService] = useState<number | null>(null); // categoryId
  const [newServiceForm, setNewServiceForm] = useState({ name: '', price: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, servRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/services')
      ]);
      const appData = await appRes.json();
      const servData = await servRes.json();
      setAppointments(appData);
      setCategories(servData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Appointments Handlers ---
  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const deleteAppointment = async (id: number) => {
    if (!confirm('Удалить эту запись навсегда?')) return;
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search) ||
      (a.service?.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  // --- Services Handlers ---
  const startEditService = (service: Service) => {
    setEditingService(service.id);
    setEditForm({ name: service.name, price: service.price });
  };

  const saveService = async (id: number) => {
    await fetch(`/api/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    setEditingService(null);
    fetchData();
  };
  
  const deleteService = async (id: number) => {
    if (!confirm('Удалить эту услугу?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const addCategory = async () => {
    if (!newCategoryName) return;
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName })
    });
    setNewCategoryName('');
    setShowAddCategory(false);
    fetchData();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Удалить эту категорию и все ее услуги?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const addService = async (categoryId: number) => {
    if (!newServiceForm.name) return;
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newServiceForm, categoryId })
    });
    setNewServiceForm({ name: '', price: 0 });
    setShowAddService(null);
    fetchData();
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', color: '#111827', padding: '40px 0', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Система управления (CRM)</h1>
          <a href="/" style={{ color: '#4b5563', fontSize: '14px', textDecoration: 'none', background: '#fff', padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            ← Вернуться на сайт
          </a>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          <button 
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500, background: activeTab === 'appointments' ? '#111827' : 'transparent', color: activeTab === 'appointments' ? '#fff' : '#4b5563' }}
            onClick={() => setActiveTab('appointments')}
          >
            Записи клиентов
          </button>
          <button 
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500, background: activeTab === 'services' ? '#111827' : 'transparent', color: activeTab === 'services' ? '#fff' : '#4b5563' }}
            onClick={() => setActiveTab('services')}
          >
            Услуги и категории
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Загрузка данных...</div>
        ) : activeTab === 'appointments' ? (
          // APPOINTMENTS TAB
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                style={{ padding: '10px 16px', fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', color: '#111827' }}
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидает</option>
                <option value="confirmed">Подтверждена</option>
                <option value="cancelled">Отменена</option>
              </select>
              <input
                type="text"
                placeholder="Поиск по имени, телефону..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '10px 16px', fontSize: '14px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', color: '#111827', width: '300px' }}
              />
            </div>

            {filteredAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', color: '#6b7280' }}>Ничего не найдено</div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>Дата и Время</th>
                      <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>Клиент</th>
                      <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>Услуга</th>
                      <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>Статус</th>
                      <th style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: 500 }}>{formatDate(a.date)}</div>
                          <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>{a.time}</div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: 500 }}>{a.name}</div>
                          <div style={{ marginTop: '4px' }}><a href={`tel:${a.phone}`} style={{ color: '#2563eb', fontSize: '13px', textDecoration: 'none' }}>{a.phone}</a></div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: 500 }}>{a.service?.name || '—'}</div>
                          <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>{a.service?.category.name}</div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <select 
                            value={a.status} 
                            onChange={(e) => updateStatus(a.id, e.target.value)}
                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#fff', color: '#111827', fontSize: '13px' }}
                          >
                            <option value="pending">Ожидает</option>
                            <option value="confirmed">Подтверждена</option>
                            <option value="cancelled">Отменена</option>
                          </select>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <button onClick={() => deleteAppointment(a.id)} style={{ color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Удалить</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          // SERVICES TAB
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => setShowAddCategory(true)} style={{ background: '#111827', color: '#fff', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                + Добавить категорию
              </button>
            </div>

            {showAddCategory && (
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Название категории" 
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1 }}
                />
                <button onClick={addCategory} style={{ background: '#059669', color: '#fff', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Сохранить</button>
                <button onClick={() => setShowAddCategory(false)} style={{ background: '#f3f4f6', color: '#4b5563', padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Отмена</button>
              </div>
            )}

            {categories.map(category => (
              <div key={category.id} style={{ marginBottom: '40px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ background: '#f9fafb', padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{category.name}</h2>
                    <button onClick={() => deleteCategory(category.id)} style={{ color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Удалить</button>
                  </div>
                  <button onClick={() => setShowAddService(category.id)} style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>+ Добавить услугу</button>
                </div>

                {showAddService === category.id && (
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px', background: '#f0fdf4' }}>
                    <input 
                      type="text" 
                      placeholder="Название услуги" 
                      value={newServiceForm.name}
                      onChange={e => setNewServiceForm({...newServiceForm, name: e.target.value})}
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', flex: 2 }}
                    />
                    <input 
                      type="number" 
                      placeholder="Цена (₽)" 
                      value={newServiceForm.price || ''}
                      onChange={e => setNewServiceForm({...newServiceForm, price: Number(e.target.value)})}
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', flex: 1 }}
                    />
                    <button onClick={() => addService(category.id)} style={{ background: '#059669', color: '#fff', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Добавить</button>
                    <button onClick={() => setShowAddService(null)} style={{ background: '#f3f4f6', color: '#4b5563', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Отмена</button>
                  </div>
                )}

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <tbody>
                    {category.services.map((s, index) => (
                      <tr key={s.id} style={{ borderBottom: index === category.services.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px', width: '60%' }}>
                          {editingService === s.id ? (
                            <input 
                              value={editForm.name} 
                              onChange={e => setEditForm({...editForm, name: e.target.value})}
                              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                          ) : <span style={{ fontWeight: 500 }}>{s.name}</span>}
                        </td>
                        <td style={{ padding: '16px', width: '20%' }}>
                          {editingService === s.id ? (
                            <input 
                              type="number"
                              value={editForm.price} 
                              onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                          ) : <span style={{ color: '#4b5563' }}>{s.price} ₽</span>}
                        </td>
                        <td style={{ padding: '16px', width: '20%' }}>
                          {editingService === s.id ? (
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button onClick={() => saveService(s.id)} style={{ color: '#059669', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Сохранить</button>
                              <button onClick={() => setEditingService(null)} style={{ color: '#6b7280', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Отмена</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button onClick={() => startEditService(s)} style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Редактировать</button>
                              <button onClick={() => deleteService(s.id)} style={{ color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Удалить</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {category.services.length === 0 && !showAddService && (
                      <tr>
                        <td colSpan={3} style={{ padding: '16px', textAlign: 'center', color: '#9ca3af' }}>Нет услуг в этой категории</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
