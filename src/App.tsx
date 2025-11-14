import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Pages/homePage';
import QuizPage from './components/Pages/quizPage';
import ClubInfoPage from './components/Pages/clubInfoPage';
import './App.css';
import React, { useEffect, useState } from 'react';

//USER
interface User {
  _id: string;
  username: string;
  email: string;
}

interface NewUserInput {
  username: string;
  email: string;
}

//CLUB
interface Club {
  _id: string;
  username: string;
  email: string;
}

interface NewClubInput {
  username: string;
  email: string;
}

function App() {
  //backend stuff <3 <3 <3

  //USER STATES
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUserInput>({ username: '', email: '' });

  //CLUB STATES

  const [clubs, setClubs] = useState<Club[]>([]);
  const [newClub, setNewClub] = useState<NewClubInput>({ username: '', email: '' });

  //ERRORS
  const [usersError, setUsersError] = useState('');
  const [clubsError, setClubsError] = useState('');

  //USERS FETCH
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

  //CLUBS FETCH
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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsersError('');

    try {
      const res = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error('Failed to create user');

      const created: User = await res.json();

      setUsers((prev) => [...prev, created]);
      setNewUser({ username: '', email: '' });
    } catch (err) {
      console.error(err);
      setUsersError('Error adding user');
    }
  };

  const handleAddClub = async (e: React.FormEvent) => {
    e.preventDefault();
    setClubsError('');

    try {
      const res = await fetch('/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClub),
      });

      if (!res.ok) throw new Error('Failed to create club');

      const created: Club = await res.json();

      setClubs((prev) => [...prev, created]);
      setNewClub({ username: '', email: '' });
    } catch (err) {
      console.error(err);
      setClubsError('Error adding club');
    }
  };

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

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
      {/* ADD USER FORM */}
      <h3>Add New User</h3>
      <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
        <input
        type="text"
        placeholder="Username"
        value={newUser.username}
        onChange={(e) =>
          setNewUser((prev) => ({ ...prev, username: e.target.value }))
        }
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, email: e.target.value }))
          }
          style={{ marginLeft: '8px' }}
        />
        <button type="submit" style={{ marginLeft: '8px' }}>
          Add User
        </button>
      </form>


      {/* ADD CLUB FORM */}
      <h3>Add New Club</h3>
      <form onSubmit={handleAddClub} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Club name"
          value={newClub.username}
          onChange={(e) =>
            setNewClub((prev) => ({ ...prev, username: e.target.value }))
          }
        />
        <input
          type="email"
          placeholder="Club email"
          value={newClub.email}
          onChange={(e) =>
            setNewClub((prev) => ({ ...prev, email: e.target.value }))
          }
          style={{ marginLeft: '8px' }}
        />
        <button type="submit" style={{ marginLeft: '8px' }}>
          Add Club
        </button>
      </form>
      </div>
    </Router>
  );
}

export default App;