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

interface Club {
  _id: string;
  username: string;
  email: string;
}

function App() {
  //backend stuff <3 <3 <3
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [usersError, setUsersError] = useState('');
  const [clubsError, setClubsError] = useState('');

  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsersError('No users found');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setUsersError('Error fetching users');
      });
  }, []);

  useEffect(() => {
    fetch('/clubs')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClubs(data);
        } else if (data && Array.isArray(data.clubs)) {
          setClubs(data.clubs);
        } else {
          setClubsError('No clubs found');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setClubsError('Error fetching clubs');
      });
  }, []);

  //frontend stuff <3 <3 <3
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/clubInfo" element={<ClubInfoPage />} />
      </Routes>

      {/* Show backend data */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>

        {/* USERS */}
        <h3>Backend Message (All Users)</h3>
        {usersError && <p style={{ color: 'red' }}>{usersError}</p>}
        {!usersError && users.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((user) => (
              <li key={user._id}>
                <strong>{user.username}</strong> — {user.email}
              </li>
            ))}
          </ul>
        ) : (
          !usersError && <p>Loading users...</p>
        )}

        {/* CLUBS */}
        <h3>Backend Message (All Clubs)</h3>
        {clubsError && <p style={{ color: 'red' }}>{clubsError}</p>}
        {!clubsError && clubs.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {clubs.map((club) => (
              <li key={club._id}>
                <strong>{club.username}</strong> — {club.email}
              </li>
            ))}
          </ul>
        ) : (
          !clubsError && <p>Loading clubs...</p>
        )}

      </div>
    </Router>
  );
}

export default App;