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

      // returns a bool if input matches regex
  function validateUsername(username: string): boolean {
    const usernameRegex = new RegExp('^[a-zA-Z0-9]{3,}$')

    return usernameRegex.test(username);
  }

  function validatePassword(password: string): boolean {
    // Password: at least 8 chars, at least one digit, at least one letter (upper and lowercase), one special character (@$!%*?&)
    const passwordRegex = new RegExp('(?=[a-zA-Z0-9@$!%*?&]*\d+)(?=[a-zA-Z0-9@$!%*?&]*[a-z]+)(?=[a-zA-Z0-9@$!%*?&]*[A-Z]+)(?=[a-zA-Z0-9@$!%*?&]*[@$!%*?&]+)[a-zA-Z0-9@$!%*?&]{8,}')

    return passwordRegex.test(password);
  }

    if (!username.trim() || !validateUsername(username)) {
      setError('Please enter a valid username');
      return;
    }
    // Basic password validation for creation: at least 8 chars
    if (!password || !validatePassword(password)) {
      setError('Password must be at least 8 characters with at least one digit, one upper and lower case letter, and one special character (@$!%*?&)');
      return;
    }

    setLoading(true);
    try {
      // Try to find an existing user by username
      const listResp = await fetch('/users');
      if (!listResp.ok) throw new Error(`Failed to fetch users: ${listResp.status}`);
      const users = await listResp.json();

      let user = users.find((u: any) => u.username === username);

      if (!user) {
        // Create a new user with password
        const createResp = await fetch('/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email: `${username}@example.com`, password }),
        });

        if (!createResp.ok) {
          const text = await createResp.text();
          throw new Error(text || `Failed to create user: ${createResp.status}`);
        }

        // Re-fetch to get the created user document
        const reList = await fetch('/users');
        const reUsers = await reList.json();
        user = reUsers.find((u: any) => u.username === username);
      } else {
        // User exists — check password if set, otherwise set it
        if (user.password) {
          // validate password match
          if (user.password !== password) {
            throw new Error('Invalid password, password does not match existing user');
          }
        } else {
          // set password on existing user via PUT (updates only provided fields)
          const id = user._id ?? user.id ?? userIdFrom(user);
          if (!id) throw new Error('User has no id to set password on');

          const updateResp = await fetch(`/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
          });

          if (!updateResp.ok) {
            const text = await updateResp.text();
            throw new Error(text || `Failed to set password: ${updateResp.status}`);
          }

          // re-fetch user
          const reList = await fetch('/users');
          const reUsers = await reList.json();
          user = reUsers.find((u: any) => u.username === username);
        }
      }

      if (!user) {
        throw new Error('Unable to locate or create user');
      }

      // Save user id in localStorage for later quiz submission
      const id = user._id ?? user.id ?? userIdFrom(user);
      if (!id) throw new Error('User has no id');
      localStorage.setItem('userId', String(id));

      // Navigate to quiz page
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
