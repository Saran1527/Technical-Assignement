import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Task } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, overdue: 0, online: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks')
        ]);
        const tasks: Task[] = taskRes.data;
        setStats({
          projects: projRes.data.length,
          tasks: tasks.length,
          overdue: tasks.filter(t => t.status === 'OVERDUE').length,
          online: 0
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: '📁', color: 'var(--primary)', borderColor: 'var(--primary)' },
    { label: 'Total Tasks', value: stats.tasks, icon: '✅', color: 'var(--primary)', borderColor: 'var(--primary)' },
    { label: 'Overdue', value: stats.overdue, icon: '⚠️', color: 'var(--danger)', borderColor: 'var(--danger)' },
    { label: 'Online Now', value: stats.online, icon: '🟢', color: 'var(--success)', borderColor: 'var(--success)' },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {statCards.map((card, i) => (
          <div key={card.label} className="card glass stat-card" style={{
            borderTop: `3px solid ${card.borderColor}`,
            animationDelay: `${i * 0.06}s`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {card.label}
              </p>
              <span style={{ fontSize: '1.25rem' }}>{card.icon}</span>
            </div>
            {isLoading ? (
              <div style={{ width: '60px', height: '36px', background: 'var(--bg-surface)', borderRadius: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ) : (
              <h2 style={{ fontSize: '2.25rem', margin: 0, color: card.color, fontWeight: 800 }}>
                {card.value}
              </h2>
            )}
          </div>
        ))}
      </div>

      {/* Enterprise Overview */}
      <div className="card glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.25rem' }}>Enterprise Overview</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comprehensive view of all teams and projects</p>
          </div>
          <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Export Data</button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'
        }}>
          <div style={{
            padding: '1.25rem', background: 'var(--bg-surface)',
            borderRadius: '0.75rem', border: '1px solid var(--border-light)'
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Task Completion Rate
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>
                {stats.tasks > 0 ? Math.round(((stats.tasks - stats.overdue) / stats.tasks) * 100) : 0}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>on track</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{
                width: stats.tasks > 0 ? `${((stats.tasks - stats.overdue) / stats.tasks) * 100}%` : '0%'
              }} />
            </div>
          </div>

          <div style={{
            padding: '1.25rem', background: 'var(--bg-surface)',
            borderRadius: '0.75rem', border: '1px solid var(--border-light)'
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Active Projects
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                {stats.projects}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>running</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${Math.min(stats.projects * 20, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
