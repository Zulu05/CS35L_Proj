// External Dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Internal Dependencies
// Services
import { fetchUsers, checkPassword, userIdFrom } from "../../services/user.service"

// Frontend
import '../css/loginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // username should not be empty
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    // check if password has been entered
    if (!password) {
      setError('Please enter a password');
      return;
    }

    setLoading(true);
    try {
      // find if user with inputted username exists
      const users = await fetchUsers();
      let user = users.find((u: any) => u.username === username);

      if (!user) {
        throw new Error('User does not exist, try signing up first');
      } else {
        // if it does, save it and attempt to log in
        localStorage.setItem('userName', String(username));
        console.log(username);
        console.log("Login attempt for username:", username);

        // User exists — check password if set, otherwise throw error 
        if (user.hasPassword()) {
          const matchingPassword  = await checkPassword(username, password);

          // validate password match
          if (!matchingPassword) {
            throw new Error('Invalid password, password does not match existing user');
          }
        } else {
          throw new Error("error finding/matching password, please try again or create new account");
        }
      }

      // save user id in local storage
      const id = user?.id ?? user?.id ?? userIdFrom(user);
      if (!id) throw new Error('User has no id');
      localStorage.setItem('userId', String(id));
      console.log(id);

      // after successfully logging in go to quiz page
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
        onClick={() => navigate('/signUp')}
        disabled={loading}
        style={{
          textDecoration: 'underline',
        }}
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
