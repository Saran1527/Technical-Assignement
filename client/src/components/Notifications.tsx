import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Notification } from '../types';
import { Bell } from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'none', border: 'none', position: 'relative' }}>
        <Bell size={24} color="var(--primary)" />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="card" style={{ position: 'absolute', right: 0, top: '40px', width: '300px', zIndex: 100, maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4>Notifications</h4>
            <button onClick={markAllRead} style={{ fontSize: '0.8rem', background: 'none', border: 'none', color: 'var(--primary)' }}>Mark all as read</button>
          </div>
          {notifications.map(n => (
            <div key={n.id} style={{ padding: '0.75rem', borderBottom: '1px solid #f1f5f9', background: n.isRead ? 'transparent' : '#f8fafc' }}>
              <p style={{ fontSize: '0.85rem' }}>{n.message}</p>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
