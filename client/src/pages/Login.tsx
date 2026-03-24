import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
        background: 'hsla(250, 89%, 67%, 0.08)', filter: 'blur(80px)',
        top: '10%', left: '20%', animation: 'pulse 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
        background: 'hsla(250, 50%, 50%, 0.06)', filter: 'blur(60px)',
        bottom: '15%', right: '25%', animation: 'pulse 8s ease-in-out infinite 2s'
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 1.5rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '1rem',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-deep))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem', boxShadow: '0 8px 24px var(--primary-glow)',
            fontSize: '1.5rem', fontWeight: 800, color: 'white'
          }}>
            V
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Velozity</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your workspace</p>
        </div>

        <form className="card glass" onSubmit={handleSubmit} style={{ padding: '2.5rem' }}>
          {error && (
            <div style={{
              background: 'var(--danger-bg)', color: 'var(--danger)',
              padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1.5rem',
              fontSize: '0.85rem', border: '1px solid hsla(0, 84%, 60%, 0.2)',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@agency.com"
              autoComplete="email"
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{
              width: '100%', padding: '0.9rem', fontSize: '0.95rem',
              opacity: isLoading ? 0.7 : 1, position: 'relative'
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'white' }} />
                Signing in...
              </span>
            ) : 'Sign In to Workspace'}
          </button>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Secure enterprise access • End-to-end encrypted
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
