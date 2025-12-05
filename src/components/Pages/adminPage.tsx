// External Dependencies
import React, { useEffect, useState } from 'react';

// Internal Dependencies
// Models
import User from '../../models/users';
import Club, { TraitScore } from '../../models/clubs';
import { TraitDefinition } from '../../models/traits';

// Services
import { fetchUsers, createUser } from '../../services/user.service';
import { fetchClubs, createClub, changeScores as updateClubScore } from '../../services/club.service';
import { fetchTraits } from '../../services/traits.service';
import { validateEmail, validateUsername, validatePassword } from '../../services/regex.service';
import { useFormState } from 'react-dom';

function AdminPage() {
  //password locking variables
  const[passwordInput, setPasswordInput] = useState('');
  const[isAdmin, setIsAdmin] = useState(false);
  const[isHacker, setIsHacker] = useState(false);
  let adminPassword = "testing";

  // ERROR & LOADING STATE
  const [usersError, setUsersError] = useState('');
  const [clubsError, setClubsError] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [updateClubLoading, setUpdateClubLoading] = useState(false);

  // TRAITS
  const [traits, setTraits] = useState<TraitDefinition[]>([]);
  const [traitsLoading, setTraitsLoading] = useState<boolean>(true);

  // FORM STATE FOR NEW USER
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  // FORM STATE FOR NEW CLUB (INCLUDING SCORES)
  const [newClub, setNewClub] = useState<{
    clubname: string;
    email: string;
    scores: TraitScore[];
  }>({
    clubname: '',
    email: '',
    scores: [],
  });

  // STATE FOR EXISTING CLUBS & EDITING SCORES
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [editScores, setEditScores] = useState<TraitScore[]>([]);

  // Helper to create default scores array (TODO: add to services later?)
  const makeDefaultScores = (ts: TraitDefinition[]): TraitScore[] =>
    ts.map((t) => ({ traitId: t.id, value: 50 }));

  const getScoreValue = (
    scores: TraitScore[],
    traitId: string
  ): number => {
    const found = scores.find((s) => s.traitId === traitId);
    return found ? found.value : 50;
  };

  const setNewClubTraitValue = (traitId: string, value: number) => {
    setNewClub((prev) => {
      const updated = prev.scores.length
        ? prev.scores
        : makeDefaultScores(traits);

      const nextScores = updated.map((s) =>
        s.traitId === traitId ? { ...s, value } : s
      );

      return { ...prev, scores: nextScores };
    });
  };

  const setEditTraitValue = (traitId: string, value: number) => {
    setEditScores((prev) => {
      const base = prev.length ? prev : makeDefaultScores(traits);
      return base.map((s) =>
        s.traitId === traitId ? { ...s, value } : s
      );
    });
  };

  // Load traits from DB
  useEffect(() => {
    (async () => {
      setTraitsLoading(true);
      const ts = await fetchTraits();
      setTraits(ts);
      setTraitsLoading(false);

      if (ts.length) {
        const defaults = makeDefaultScores(ts);
        setNewClub((prev) => ({ ...prev, scores: defaults }));
        setEditScores(defaults);
      }
    })();
  }, []);

  // Load clubs from DB
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

    if (!traits.length) {
      setClubsError('Traits are not loaded yet. Try again in a moment.');
      return;
    }

    const scoresToSend =
      newClub.scores.length > 0
        ? newClub.scores
        : makeDefaultScores(traits);

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
        scores: scoresToSend,
      };

      const created = await createClub(payload);
      console.log('Created club:', created);

      const list = await fetchClubs();
      setClubs(list);

// ensure scores exists in DB even when "empty"
      const defaults = makeDefaultScores(traits);
      setNewClub({
        clubname: '',
        email: '',
        scores: defaults,
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

    if (!traits.length) {
      setEditScores([]);
      return;
    }

    if (club && (club as any).scores) {
      const s: any = (club as any).scores;

      if (Array.isArray(s)) {
        const updated: TraitScore[] = traits.map((t) => {
          const found = s.find((ts: any) => ts.traitId === t.id);
          return {
            traitId: t.id,
            value: found ? Number(found.value) : 50,
          };
        });
        setEditScores(updated);
      } else {
        const updated: TraitScore[] = traits.map((t) => {
          const val = s[t.id] ?? 50;
          return { traitId: t.id, value: Number(val) };
        });
        setEditScores(updated);
      }
    } else {
      setEditScores(makeDefaultScores(traits));
    }
  };

  const handleUpdateScores = async (e: React.FormEvent) => {
    e.preventDefault();
    setClubsError('');

    if (!selectedClubId) {
      setClubsError('Please select a club to update.');
      return;
    }

    if (!traits.length) {
      setClubsError('Traits are not loaded yet.');
      return;
    }

    const scoresToSend =
      editScores.length > 0 ? editScores : makeDefaultScores(traits);

    setUpdateClubLoading(true);
    try {
      const updated = await updateClubScore(selectedClubId, scoresToSend);
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

  if (traitsLoading) {
    return (
      <div className="page">
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h1>Admin Panel</h1>
          <p>Loading traits...</p>
        </div>
      </div>
    );
  }

  //handleSubmit for admingpage password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput == adminPassword){setIsAdmin(true);}
    else {setIsHacker(true)}
  }
  return (
    <>
    {!isAdmin?(
    <div className="admin-page">
      <form onSubmit={handleSubmit} className="login-form">
          <label>
            {!isHacker? (<span>Password</span>):(<span style = {{color:"red"}}>HACKER</span>)}
            <input
              className="password-input"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </label>
        </form>
        </div>
        ):(
      <div className="admin-page">
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
            {traits.map((trait) => (
              <div key={trait.id} style={{ marginTop: 8 }}>
                <label style={{ marginRight: 4 }}>
                  {trait.labelLeft} / {trait.labelRight}:
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={getScoreValue(newClub.scores, trait.id)}
                  onChange={(e) =>
                    setNewClubTraitValue(trait.id, Number(e.target.value))
                  }
                />
              </div>
            ))}
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
            {traits.map((trait) => (
              <div key={trait.id} style={{ marginTop: 8 }}>
                <label style={{ marginRight: 4 }}>
                  {trait.labelLeft} / {trait.labelRight}:
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={getScoreValue(editScores, trait.id)}
                  onChange={(e) =>
                    setEditTraitValue(trait.id, Number(e.target.value))
                  }
                />
              </div>
            ))}
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
  )}
  </>);
}

export default AdminPage;
