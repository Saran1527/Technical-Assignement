import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Project } from '../../types';

const PMDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await api.get('/projects');
        setProjects(projRes.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColors = ['var(--primary)', 'var(--success)', 'var(--warning)', '#fb923c'];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="text-gradient">Portfolio Overview</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card glass" style={{ minHeight: '160px', animation: 'pulse 1.5s ease-in-out infinite' }}>
                <div style={{ width: '60%', height: '16px', background: 'var(--bg-surface)', borderRadius: '0.5rem', marginBottom: '1rem' }} />
                <div style={{ width: '90%', height: '12px', background: 'var(--bg-surface)', borderRadius: '0.5rem', marginBottom: '0.75rem' }} />
                <div style={{ width: '40%', height: '12px', background: 'var(--bg-surface)', borderRadius: '0.5rem' }} />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="card glass empty-state">
            <span style={{ fontSize: '2.5rem' }}>📁</span>
            <p style={{ fontWeight: 600, fontSize: '1rem' }}>No projects yet</p>
            <p style={{ fontSize: '0.85rem' }}>Projects assigned to you will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {projects.map((p, i) => (
              <div key={p.id} className="card glass" style={{ animationDelay: `${i * 0.06}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '0.6rem',
                      background: `${statusColors[i % statusColors.length]}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', flexShrink: 0
                    }}>📁</div>
                    <h4 style={{ fontSize: '1rem', marginBottom: 0 }}>{p.name}</h4>
                  </div>
                  <span className="status-badge status-in_progress">ACTIVE</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {p.description || 'No description provided.'}
                </p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{30 + (i * 15) % 60}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${30 + (i * 15) % 60}%` }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}>Manage</button>
                  <button className="btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}>Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strategic Priority */}
      <div className="card glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Strategic Priority</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>This quarter</span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'
        }}>
          {[
            { label: 'High Priority', count: projects.length > 0 ? Math.ceil(projects.length * 0.3) : 0, color: 'var(--danger)' },
            { label: 'Medium', count: projects.length > 0 ? Math.ceil(projects.length * 0.5) : 0, color: 'var(--warning)' },
            { label: 'On Track', count: projects.length > 0 ? Math.ceil(projects.length * 0.2) : 0, color: 'var(--success)' },
          ].map(item => (
            <div key={item.label} style={{
              padding: '1rem', background: 'var(--bg-surface)',
              borderRadius: '0.75rem', textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color, marginBottom: '0.25rem' }}>{item.count}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PMDashboard;
