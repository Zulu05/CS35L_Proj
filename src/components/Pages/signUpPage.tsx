// External Dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal Dependencies
// Services
import { fetchUsers, createUser, userIdFrom } from "../../services/user.service"
import {validatePassword, validateUsername, validateEmail} from "../../services/regex.service"

// Frontend
import '../css/loginPage.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !validateUsername(username)) {
      setError('Username must be at least 3 alphanumeric characters');
      return;
    }
    // Validate email presence and format
    if (!email.trim() || !validateEmail(email)) {
      setError('Please enter a valid email address');
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
      const users = await fetchUsers();
      let user = users.find((u: any) => u.username === username);

      if (!user) {
        // Create a new user with password
        const addedUser = await createUser({username, email, password});
        console.log(addedUser);
        // Re-fetch to get the created user document
        const reUsers = await fetchUsers();
        user = reUsers.find((u: any) => u.username === username);
      } else {
        // User exists
          throw new Error('User already exists, try logining in instead');
      }

      if (!user) {
        throw new Error('Unable to locate or create user');
      }

      // Save user id and username in localStorage for later quiz submission and profile display
      const id = user.id ?? user.id ?? userIdFrom(user);
      if (!id) throw new Error('User has no id');
      localStorage.setItem('userId', String(id));
      localStorage.setItem('userName', String(username));
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

  return (
    <div className="login-page">
      <h1>Sign Up</h1>
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
            Email
            <input
              className="styled-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <button type="button" onClick={() => navigate('/')} disabled={loading}>
            Cancel
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
