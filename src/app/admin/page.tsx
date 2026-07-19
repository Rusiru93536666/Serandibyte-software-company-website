'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#00E5FF', textAlign: 'center' }}>
            Admin Login
          </h2>
          <p style={{ marginTop: '0.5rem', textAlign: 'center', color: '#9ca3af' }}>
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff',
                outline: 'none'
              }}
              placeholder="Username"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff',
                outline: 'none'
              }}
              placeholder="Password"
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#f87171',
              textAlign: 'center',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              background: '#00E5FF',
              color: '#000',
              fontWeight: '600',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="/" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}