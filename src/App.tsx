import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Pages/homePage';
import QuizPage from './components/Pages/quizPage';
import ClubInfoPage from './components/Pages/clubInfoPage';
import './App.css';
import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  username: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setError('No users found');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching users');
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/clubInfo" element={<ClubInfoPage />} />
      </Routes>

      {/* Show backend data */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h3>Backend Message (All Users)</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!error && users.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((user) => (
              <li key={user._id}>
                <strong>{user.username}</strong> — {user.email}
              </li>
            ))}
          </ul>
        ) : (
          !error && <p>Loading users...</p>
        )}
      </div>
    </Router>
  );
}

export default App;