import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Club from '../../models/clubs';
import User from '../../models/users';
import { fetchClubs, createClub } from '../../services/club.service';
import { fetchUsers, createUser } from '../../services/user.service';
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from '../../services/regex.service';

function HomePage() {
  const navigate = useNavigate();

  // ERROR & LOADING STATE
  const [usersError, setUsersError] = useState('');
  const [clubsError, setClubsError] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [clubsLoading, setClubsLoading] = useState(false);

  // FORM STATE FOR NEW USER
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  // FORM STATE FOR NEW CLUB
  const [newClub, setNewClub] = useState({
    clubname: '',
    email: '',
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsersError('');

    // Allow empty values, but validate anything that *is* provided
    if (newUser.username && !validateUsername(newUser.username)) {
      setUsersError('Username must be at least 3 alphanumeric characters.');
      return;
    }

    if (newUser.email && !validateEmail(newUser.email)) {
      setUsersError('Please enter a valid email address.');
      return;
    }

    if (newUser.password && !validatePassword(newUser.password)) {
      setUsersError(
        'Password must be at least 8 characters and include a digit, an upper and lower case letter, and a special character.'
      );
      return;
    }

    setUsersLoading(true);
    try {
      // Only check duplicates if a username is actually provided
      if (newUser.username.trim()) {
        const users: User[] = await fetchUsers();
        const existing = users.find((u) => u.username === newUser.username);
        if (existing) {
          setUsersError('User already exists, try logging in instead.');
          return;
        }
      }

      const payload = {
        username: newUser.username || '',
        email: newUser.email || '',
        password: newUser.password || '',
        // ensure field exists & is "empty" in DB
        quizResponses: [] as any[],
      };

      const created = await createUser(payload);
      console.log('Created user:', created);

      // Clear form after success
      setNewUser({ username: '', email: '', password: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Add user error:', msg);
      setUsersError(msg || 'Error adding user.');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAddClub = async (e: React.FormEvent) => {
    e.preventDefault();
    setClubsError('');

    // Allow empty, but validate anything that’s typed
    if (newClub.clubname && !validateUsername(newClub.clubname)) {
      setClubsError('Club name must be at least 3 alphanumeric characters.');
      return;
    }

    if (newClub.email && !validateEmail(newClub.email)) {
      setClubsError('Please enter a valid club email.');
      return;
    }

    setClubsLoading(true);
    try {
      if (newClub.clubname.trim()) {
        const clubs: Club[] = await fetchClubs();
        const existing = clubs.find((c) => c.clubname === newClub.clubname);
        if (existing) {
          setClubsError('Club already exists.');
          return;
        }
      }

      const payload = {
        clubname: newClub.clubname || '',
        email: newClub.email || '',
        // ensure scores exists in DB even when "empty"
        scores: {
          social: 50,
          academic: 50,
          leadership: 50,
          creativity: 50,
        },
      };

      const created = await createClub(payload);
      console.log('Created club:', created);

      setNewClub({ clubname: '', email: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Add club error:', msg);
      setClubsError(msg || 'Error adding club.');
    } finally {
      setClubsLoading(false);
    }
  };

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  return (
    <div className="page">
      <h1>Welcome to the Quiz App</h1>

      <button
        onClick={() => {
          const id = localStorage.getItem('userId');
          navigate(id ? '/quiz' : '/login');
        }}
      >
        Start Quiz
      </button>

      {userId && (
        <>
          <button
            onClick={() => {
              localStorage.removeItem('userId');
              navigate('/');
            }}
            style={{ marginLeft: 8 }}
          >
            Logout
          </button>
          <button
            onClick={() => {
              const id = localStorage.getItem('userId');
              navigate(id ? '/profile' : '/login');
            }}
            style={{ marginLeft: 8 }}
          >
            Profile
          </button>
        </>
      )}

      {!userId && (
        <button
          onClick={() => {
            navigate('/login');
          }}
          style={{ marginLeft: 8 }}
        >
          Login
        </button>
      )}

      <h2>What do we do?</h2>
      <p>
        This is a quiz app that lets you take a quiz to match you with a club at
        UCLA. To see more information about clubs on campus, click the button
        below.
      </p>
      <button onClick={() => navigate('/clubInfo')}>Club Information</button>
      <h3>Credits: us heheheh</h3>

      {/* Dev helper section: add users & clubs into DB */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Dev Tools: Add Users & Clubs</h2>

        {/* ADD USER FORM */}
        <h3>Add New User</h3>
        <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Username (optional)"
            value={newUser.username}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, username: e.target.value }))
            }
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={newUser.email}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, email: e.target.value }))
            }
            style={{ marginLeft: '8px' }}
          />
          <input
            type="password"
            placeholder="Password (optional)"
            value={newUser.password}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, password: e.target.value }))
            }
            style={{ marginLeft: '8px' }}
          />
          <button
            type="submit"
            style={{ marginLeft: '8px' }}
            disabled={usersLoading}
          >
            {usersLoading ? 'Adding...' : 'Add User'}
          </button>
        </form>
        {usersError && (
          <div style={{ color: 'crimson', marginBottom: 24 }}>{usersError}</div>
        )}

        {/* ADD CLUB FORM */}
        <h3>Add New Club</h3>
        <form onSubmit={handleAddClub} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Club name (optional)"
            value={newClub.clubname}
            onChange={(e) =>
              setNewClub((prev) => ({ ...prev, clubname: e.target.value }))
            }
          />
          <input
            type="email"
            placeholder="Club email (optional)"
            value={newClub.email}
            onChange={(e) =>
              setNewClub((prev) => ({ ...prev, email: e.target.value }))
            }
            style={{ marginLeft: '8px' }}
          />
          <button
            type="submit"
            style={{ marginLeft: '8px' }}
            disabled={clubsLoading}
          >
            {clubsLoading ? 'Adding...' : 'Add Club'}
          </button>
        </form>
        {clubsError && <div style={{ color: 'crimson' }}>{clubsError}</div>}
      </div>
    </div>
  );
}

export default HomePage;
