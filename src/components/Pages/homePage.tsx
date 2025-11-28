import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

function HomePage() {
  const navigate = useNavigate();

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

  // returns a bool if input matches regex
  function validateUsername(username: string): boolean {
    const usernameRegex = new RegExp('[a-zA-Z0-9]{3,}')

    return usernameRegex.test(username);
  }
    function validateEmail(email: string): boolean {
    const emailRegex = new RegExp('[a-zA-Z0-9]+([a-zA-Z0-9.-]*[a-zA-Z0-9])?@[a-zA-Z0-9]+([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}')

    return emailRegex.test(email);
  }
  
  function validatePassword(password: string): boolean {
    // Password: at least 8 chars, at least one digit, at least one letter (upper and lowercase), one special character (@$!%*?&)
    const passwordRegex = new RegExp('(?=[a-zA-Z0-9@$!%*?&]*\d+)(?=[a-zA-Z0-9@$!%*?&]*[a-z]+)(?=[a-zA-Z0-9@$!%*?&]*[A-Z]+)(?=[a-zA-Z0-9@$!%*?&]*[@$!%*?&]+)[a-zA-Z0-9@$!%*?&]{8,}')

    return passwordRegex.test(password);
  }

  const handleAddUser = async (e: React.FormEvent) => {
    setUsersError('');

    if (!validateUsername(newUser.username)) {
      setUsersError('Invalid Username. Usernames must be at least 3 alphabetic or numerical characters long.')
      return;
    }

    if (!validateEmail(newUser.email)) {
      setUsersError('Invalid Email.')
      return;
    }

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
    setClubsError('');

    if (!validateUsername(newClub.username)) {
      setUsersError('Invalid Username. Usernames must be at least 3 alphabetic or numerical characters long.')
      return;
    }

    if (!validateEmail(newClub.email)) {
      setUsersError('Invalid Email.')
      return;
    }

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
  
  //If user logged in go to quiz, else go to login
  return (
    <div className="page">
      <h1>Welcome to the Quiz App</h1>

      <button onClick={() => {
        const userId = localStorage.getItem("userId");
        navigate(userId ? '/quiz' : '/login');
      }}
      >
        Start Quiz
      </button>
      
      {localStorage.getItem("userId") && (
        <button onClick={() => {
          localStorage.removeItem("userId");
          navigate('/');
        }} style={{ marginLeft: 8 }}>
          Logout
        </button>
      )}

      <button onClick={() => {
        const userId = localStorage.getItem("userId");
        navigate(userId ? '/profile' : '/login');
      }}
      >
        Profile
      </button>

      <h2>What do we do?</h2>
      <p>This is a quiz app that lets you take a quiz to match you with a club at UCLA. To see more information about clubs on campus, click the button below</p>
      <button onClick={() => navigate('/clubInfo')}>
        Club Information
      </button>
      <h3>Credits: us heheheh</h3>

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
    </div>
  );
}

export default HomePage;