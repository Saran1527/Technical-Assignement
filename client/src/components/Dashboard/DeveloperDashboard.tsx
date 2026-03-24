import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { type Task, TaskStatus } from '../../types';

const statusConfig: Record<string, { bg: string; color: string }> = {
  TODO: { bg: 'hsla(215, 15%, 45%, 0.2)', color: 'var(--text-secondary)' },
  IN_PROGRESS: { bg: 'hsla(250, 89%, 67%, 0.15)', color: 'var(--primary-light)' },
  IN_REVIEW: { bg: 'var(--warning-bg)', color: 'var(--warning)' },
  DONE: { bg: 'var(--success-bg)', color: 'var(--success)' },
  OVERDUE: { bg: 'var(--danger-bg)', color: 'var(--danger)' },
};

const DeveloperDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const completedCount = tasks.filter(t => t.status === 'DONE').length;
  const overdueCount = tasks.filter(t => t.status === 'OVERDUE').length;

  return (
    <div>
      {/* Quick Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card glass" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Active</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{tasks.length}</p>
        </div>
        <div className="card glass" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Completed</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{completedCount}</p>
        </div>
        <div className="card glass" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Overdue</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>{overdueCount}</p>
        </div>
      </div>

      {/* Sprint Backlog Table */}
      <div className="card glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 className="text-gradient" style={{ marginBottom: '0.2rem' }}>Sprint Backlog</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tasks.length} tasks assigned</p>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '48px', background: 'var(--bg-surface)', borderRadius: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: '2.5rem' }}>✅</span>
            <p style={{ fontWeight: 600 }}>All caught up!</p>
            <p style={{ fontSize: '0.85rem' }}>No tasks assigned yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-light)' }}>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>TASK</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PRIORITY</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>DEADLINE</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => {
                  const isOverdue = t.status === 'OVERDUE';
                  const dueDate = new Date(t.dueDate);
                  const isNearDue = !isOverdue && dueDate.getTime() - Date.now() < 2 * 24 * 60 * 60 * 1000;

                  return (
                    <tr key={t.id} style={{
                      borderBottom: '1px solid hsla(217, 33%, 25%, 0.25)',
                      transition: 'background 0.2s ease'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.title}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`priority-badge priority-${t.priority.toLowerCase()}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                        <span style={{ color: isOverdue ? 'var(--danger)' : isNearDue ? 'var(--warning)' : 'var(--text-secondary)' }}>
                          {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select
                          value={t.status}
                          onChange={(e) => handleStatusChange(t.id, e.target.value as TaskStatus)}
                          style={{
                            background: statusConfig[t.status]?.bg || 'transparent',
                            color: statusConfig[t.status]?.color || 'var(--text-primary)',
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            width: 'auto',
                            borderRadius: '2rem',
                            border: 'none !important',
                            cursor: 'pointer'
                          }}
                        >
                          {Object.values(TaskStatus).map(s => (
                            <option key={s} value={s} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                              {s.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperDashboard;
