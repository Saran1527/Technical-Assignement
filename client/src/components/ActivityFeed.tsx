import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { ActivityLog } from '../types';
import { io } from 'socket.io-client';

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await api.get('/activities');
      setActivities(res.data);
    };
    fetchHistory();

    const socket = io('http://localhost:5000');

    socket.on('global_activity', (newLog: ActivityLog) => {
      setActivities(prev => [newLog, ...prev.slice(0, 19)]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="card glass" style={{ height: "80vh", overflowY: "auto", scrollbarWidth: "none" }}>
      <h3 className="text-gradient">Activity Feed</h3>
      <div style={{ marginTop: '1.5rem' }}>
        {activities.map(log => (
          <div key={log.id} style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{log.action}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {activities.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
