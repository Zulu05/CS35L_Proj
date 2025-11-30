import React, { useEffect, useState } from 'react';
import Club from '../../models/clubs';
import User from '../../models/users';
import {
  fetchClubs,
  createClub,
  changeScores as updateClubScores,
} from '../../services/club.service';
import { fetchUsers, createUser } from '../../services/user.service';
import {
  validateEmail,
  validateUsername,
  validatePassword,
} from '../../services/regex.service';

function AdminPage() {
  // ERROR & LOADING STATE
  const [usersError, setUsersError] = useState('');
  const [clubsError, setClubsError] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [updateClubLoading, setUpdateClubLoading] = useState(false);

  // FORM STATE FOR NEW USER
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  // FORM STATE FOR NEW CLUB (INCLUDING SCORES)
  const [newClub, setNewClub] = useState({
    clubname: '',
    email: '',
    social: 50,
    academic: 50,
    leadership: 50,
    creativity: 50,
  });

  // STATE FOR EXISTING CLUBS & EDITING SCORES
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [editScores, setEditScores] = useState({
    social: 50,
    academic: 50,
    leadership: 50,
    creativity: 50,
  });

  useEffect(() => {
    (async () => {
      const list = await fetchClubs();
      setClubs(list);
    })();
  }, []);

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
        const existingClubs: Club[] = await fetchClubs();
        const existing = existingClubs.find(
          (c: any) => c.clubname === newClub.clubname
        );
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
          social: newClub.social,
          academic: newClub.academic,
          leadership: newClub.leadership,
          creativity: newClub.creativity,
        },
      };

      const created = await createClub(payload);
      console.log('Created club:', created);

      const list = await fetchClubs();
      setClubs(list);

      setNewClub({
        clubname: '',
        email: '',
        social: 50,
        academic: 50,
        leadership: 50,
        creativity: 50,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Add club error:', msg);
      setClubsError(msg || 'Error adding club.');
    } finally {
      setClubsLoading(false);
    }
  };

  const handleSelectClub = (clubId: string) => {
    setSelectedClubId(clubId);
    const club = clubs.find((c: any) => c._id === clubId || c.id === clubId);
    if (club && (club as any).scores) {
      const s = (club as any).scores;
      setEditScores({
        social: s.social ?? 50,
        academic: s.academic ?? 50,
        leadership: s.leadership ?? 50,
        creativity: s.creativity ?? 50,
      });
    } else {
      setEditScores({
        social: 50,
        academic: 50,
        leadership: 50,
        creativity: 50,
      });
    }
  };

  const handleUpdateScores = async (e: React.FormEvent) => {
    e.preventDefault();
    setClubsError('');

    if (!selectedClubId) {
      setClubsError('Please select a club to update.');
      return;
    }

    setUpdateClubLoading(true);
    try {
      const updated = await updateClubScores(selectedClubId, {
        social: editScores.social,
        academic: editScores.academic,
        leadership: editScores.leadership,
        creativity: editScores.creativity,
      });
      console.log('Updated club scores:', updated);

      const list = await fetchClubs();
      setClubs(list);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Update club scores error:', msg);
      setClubsError(msg || 'Error updating club scores.');
    } finally {
      setUpdateClubLoading(false);
    }
  };

  return (
    <div className="page">
     
      {/* Dev helper section: add users & clubs into DB */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h1>Admin Panel</h1>
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

        {/* ADD CLUB FORM WITH SCORES */}
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

          <div style={{ marginTop: 10 }}>
            <label style={{ marginRight: 4 }}>Social:</label>
            <input
              type="number"
              min={0}
              max={100}
              value={newClub.social}
              onChange={(e) =>
                setNewClub((prev) => ({
                  ...prev,
                  social: Number(e.target.value),
                }))
              }
            />
            <label style={{ marginLeft: 12, marginRight: 4 }}>Academic:</label>
            <input
              type="number"
              min={0}
              max={100}
              value={newClub.academic}
              onChange={(e) =>
                setNewClub((prev) => ({
                  ...prev,
                  academic: Number(e.target.value),
                }))
              }
            />
            <label style={{ marginLeft: 12, marginRight: 4 }}>
              Leadership:
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={newClub.leadership}
              onChange={(e) =>
                setNewClub((prev) => ({
                  ...prev,
                  leadership: Number(e.target.value),
                }))
              }
            />
            <label style={{ marginLeft: 12, marginRight: 4 }}>
              Creativity:
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={newClub.creativity}
              onChange={(e) =>
                setNewClub((prev) => ({
                  ...prev,
                  creativity: Number(e.target.value),
                }))
              }
            />
          </div>

          <button
            type="submit"
            style={{ marginLeft: '8px', marginTop: 10 }}
            disabled={clubsLoading}
          >
            {clubsLoading ? 'Adding...' : 'Add Club'}
          </button>
        </form>

        {/* UPDATE EXISTING CLUB SCORES */}
        <h3>Update Club Scores</h3>
        <form onSubmit={handleUpdateScores} style={{ marginBottom: '20px' }}>
          <select
            value={selectedClubId}
            onChange={(e) => handleSelectClub(e.target.value)}
          >
            <option value="">Select a club...</option>
            {clubs.map((c: any) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.clubname || c.username || '(no name)'}
              </option>
            ))}
          </select>

          <div style={{ marginTop: 10 }}>
            <label style={{ marginRight: 4 }}>Social:</label>
            <input
              type="number"
              min={0}
              max={100}
              value={editScores.social}
              onChange={(e) =>
                setEditScores((prev) => ({
                  ...prev,
                  social: Number(e.target.value),
                }))
              }
            />
            <label style={{ marginLeft: 12, marginRight: 4 }}>Academic:</label>
            <input
              type="number"
              min={0}
              max={100}
              value={editScores.academic}
              onChange={(e) =>
                setEditScores((prev) => ({
                  ...prev,
                  academic: Number(e.target.value),
                }))
              }
            />
            <label style={{ marginLeft: 12, marginRight: 4 }}>
              Leadership:
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={editScores.leadership}
              onChange={(e) =>
                setEditScores((prev) => ({
                  ...prev,
                  leadership: Number(e.target.value),
                }))
              }
            />
            <label style={{ marginLeft: 12, marginRight: 4 }}>
              Creativity:
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={editScores.creativity}
              onChange={(e) =>
                setEditScores((prev) => ({
                  ...prev,
                  creativity: Number(e.target.value),
                }))
              }
            />
          </div>

          <button
            type="submit"
            style={{ marginLeft: '8px', marginTop: 10 }}
            disabled={updateClubLoading}
          >
            {updateClubLoading ? 'Updating...' : 'Update Scores'}
          </button>
        </form>

        {clubsError && (
          <div style={{ color: 'crimson', marginBottom: 24 }}>{clubsError}</div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
