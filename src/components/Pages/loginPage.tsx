import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './quizPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      // Try to find an existing user by username
      const listResp = await fetch('/users');
      if (!listResp.ok) throw new Error(`Failed to fetch users: ${listResp.status}`);
      const users = await listResp.json();

      // backend returns documents with `_id` from Mongo; check for either
      let user = users.find((u: any) => u.username === username);

      if (!user) {
        // Create a new user (backend `POST /users` expects a User object)
        const createResp = await fetch('/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email: `${username}@example.com` }),
        });

        if (!createResp.ok) {
          const text = await createResp.text();
          throw new Error(text || `Failed to create user: ${createResp.status}`);
        }

        // Re-fetch users list to find the created user (backend POST returns only a text message)
        const reList = await fetch('/users');
        const reUsers = await reList.json();
        user = reUsers.find((u: any) => u.username === username);
      }

      if (!user) {
        throw new Error('Unable to locate or create user');
      }

      // Save user id in localStorage for later quiz submission
      const id = user._id ?? user.id ?? userIdFrom(user);
      if (!id) throw new Error('User has no id');
      localStorage.setItem('userId', String(id));

      // Navigate to quiz page (adjust route if different)
      navigate('/quiz');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Login error:', msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // helper for some shapes
  function userIdFrom(u: any) {
    if (!u) return null;
    if (u._id) return u._id;
    if (u.id) return u.id;
    if (u.insertedId) return u.insertedId;
    return null;
  }

  return (
    <div className="quiz-page">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
              disabled={loading}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
              disabled={loading}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in / Create account'}
          </button>
          <button type="button" onClick={() => navigate('/')} disabled={loading}>
            Cancel
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, color: 'crimson' }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
