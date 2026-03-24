import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import PMDashboard from '../components/Dashboard/PMDashboard';
import DeveloperDashboard from '../components/Dashboard/DeveloperDashboard';
import ActivityFeed from '../components/ActivityFeed';
import Notifications from '../components/Notifications';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', icon: '📊', active: true },
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '0.6rem',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-deep))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 800, color: 'white',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>V</div>
          <h2 className="text-gradient" style={{ fontSize: '1.35rem', marginBottom: 0 }}>Velozity</h2>
        </div>

        {/* User Card */}
        <div style={{
          padding: '1rem', borderRadius: '0.75rem',
          background: 'var(--bg-surface)', marginBottom: '1.5rem',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="avatar avatar-sm">{user.name.charAt(0)}</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 }}>{user.name}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Sign Out */}
        <button onClick={logout} className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>🚪</span> Sign Out
        </button>
      </aside>

      <main style={{ height: "100vh", scrollbarWidth: "none" }} className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="text-gradient" style={{ marginBottom: '0.25rem' }}>Welcome back, {user.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Observe metrics and manage your workspace.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Notifications />
            <div className="avatar">{user.name.charAt(0)}</div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          <section>
            {user.role === UserRole.ADMIN && <AdminDashboard />}
            {user.role === UserRole.PROJECT_MANAGER && <PMDashboard />}
            {user.role === UserRole.DEVELOPER && <DeveloperDashboard />}
          </section>
          <aside>
            <ActivityFeed />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
