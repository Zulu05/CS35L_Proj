// External Dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal Dependencies
// Services
import { fetchUsers, checkPassword, userIdFrom } from "../../services/user.service"
import { validatePassword, validateUsername } from "../../services/regex.service"

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

    if (!username.trim() || !validateUsername(username)) {
      setError('Please enter a valid username, at least 3 alphanumeric characters');
      return;
    }
    // Basic password validation for creation: at least 8 chars
    if (!password || !validatePassword(password)) {
      setError('Password must be at least 8 characters with at least one digit, one upper and lower case letter, and one special character (@$!%*?&)');
      return;
    }

    //try catch block handles login behavior and stores username and id
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

        // User exists — check password if set, otherwise throw error 
        if (user.hasPassword()) {
          console.log(password);
          console.log("User from DB:", user);
          const matchingPassword  = await checkPassword(username, password);

          // validate password match
          if (!matchingPassword) {
            throw new Error('Invalid password, password does not match existing user');
          }
        } else {
          throw new Error("error finding/matching password, please try again or create new account");
        }
      }

      // Save user id in localStorage for later quiz submission
      const id = user?.id ?? user?.id ?? userIdFrom(user);
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

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: '0 auto', textAlign: 'left' }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              disabled={loading}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <button type="button" onClick={() => navigate('/')} disabled={loading}>
            Cancel
          </button>
        </div>

      <button
        type="button"
        onClick={() => navigate('/signUp')}
        disabled={loading}
        style={{
          textDecoration: 'underline',
        }}
      >
        No account? Sign Up Here
      </button>

        {error && (
          <div style={{ marginTop: 12, color: 'crimson' }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
