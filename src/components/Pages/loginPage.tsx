// External Dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal Dependencies
// Services
import { fetchUsers, addPassword, checkPassword } from "../../services/user.service"
// Frontend
import '../css/loginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Only check if empty. Do not Regex validate existing users.
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    // We do NOT enforce complexity here (e.g. special chars) because 
    // legacy passwords might not meet new rules.
    if (!password) {
      setError('Please enter a password');
      return;
    }

    setLoading(true);
    try {
      // Try to find an existing user by username
      const users = await fetchUsers();
      let user = users.find((u: any) => u.username === username);

      if (!user) {
        throw new Error('User does not exist, try signing up first');
      } else {
        //User exists - save username
        localStorage.setItem('userName', String(username));
        console.log(username);
        console.log("Login attempt for username:", username);

        // User exists — check password if set, otherwise set it
        if (user.hasPassword()) {
          console.log(password);
          console.log("User from DB:", user);
          const matchingPassword  = await checkPassword(username, password);

          // validate password match
          if (!matchingPassword) {
            throw new Error('Invalid password, password does not match existing user');
          }
        } else {
          // set password on existing user via PUT (updates only provided fields)
          const id = user.id ?? user.id ?? userIdFrom(user);
          if (!id) throw new Error('User has no id to set password on');
          const changedUser = await addPassword(id, password);
          console.log(changedUser);
          // re-fetch user
          const reUsers = await fetchUsers();
          user = reUsers.find((u: any) => u.username === username);
        }
      }

      if (!user) {
        throw new Error('Unable to locate or create user');
      }

      // Save user id in localStorage for later quiz submission
      const id = user.id ?? user.id ?? userIdFrom(user);
      if (!id) throw new Error('User has no id');
      localStorage.setItem('userId', String(id));
      console.log(id);

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
    <div className="login-page">
      <h1>Login</h1>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>
            Username
            <input
              className="styled-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            Password
            <input
              className="styled-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </label>
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <button type="button" onClick={() => navigate('/')} disabled={loading}>
            Cancel
          </button>
        </div>

        <button
          type="button"
          className="link-button"
          onClick={() => navigate('/signUp')}
          disabled={loading}
        >
          No account? Sign Up Here
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
