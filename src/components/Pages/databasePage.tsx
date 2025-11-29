import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Club from "../../models/clubs";
import User from "../../models/users";
import { fetchClubs, createClub } from "../../services/club.service"
import { fetchUsers, createUser } from "../../services/user.service"
import { setuid } from "process";

const DataBasePage: React.FC = () => {
    const navigate = useNavigate();

  // States
  const [users, setUsers] = useState<User[]>([]);
  //const [userResults, setUserResults] = useState<UserResults[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [usersError, setUsersError] = useState<string>("");
  const [userResultsError, setUserResultsError] = useState<string>("");
  const [clubsError, setClubsError] = useState<string>("");
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [userResultsLoading, setUserResultsLoading] = useState<boolean>(true);
  const [clubsLoading, setClubsLoading] = useState<boolean>(true);

  //getting users
  useEffect(() => {(
    async () => {
    try{
      setUsersLoading(true);
      const data = await fetchUsers(); 
      setUsers(data); 
      }
      catch (err){
        setUsersError("error fetching users: ${err");
      } finally
      {
        setUsersLoading(false)
      }
      }) ();
  } , []);
  //getting clubs 
  useEffect(()=>{
    (async () => {
    try{
    setClubsLoading(true);
    const data = await fetchClubs();
    setClubs(data);
    }
    catch (err){
      setClubsError("error fetching users: ${err");
    } finally
    {
      setClubsLoading(false)
    }
  })
  ();
  }, []);
  return (    
    <>
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h1>Library</h1>
          {/* USERS */}
          <section>
              <h2>Users</h2>
              {usersError && <p style={{ color: "red" }}>{usersError}</p>}
              {usersLoading && !usersError && <p>Loading users...</p>}
              {!usersLoading && users.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                      {users.map((user) => (
                          <li key={user.id?.toString()}>
                              <strong>{user.username}</strong> — {user.email}
                          </li>
                      ))}
                  </ul>
              )}
          </section>

          {/* USER RESULTS */}
          {/* <section>
              <h2>User Results</h2>
              {userResultsError && <p style={{ color: "red" }}>{userResultsError}</p>}
              {userResultsLoading && !userResultsError && <p>Loading user results...</p>}
              {!userResultsLoading && userResults.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                      {userResults.map((user) => (
                          <li key={user.userId}>
                              <strong>{user.userId}</strong> — {user.scores.social} — {user.scores.academic} — {user.scores.leadership} — {user.scores.creativity}
                          </li>
                      ))}
                  </ul>
              )}
          </section> */}

          {/* CLUBS */}
          <section style={{ marginTop: "40px" }}>
              <h2>Clubs</h2>
              {clubsError && <p style={{ color: "red" }}>{clubsError}</p>}
              {clubsLoading && !clubsError && <p>Loading clubs...</p>}
              {!clubsLoading && clubs.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                      {clubs.map((club) => (
                          <li key={club.id?.toString()}>
                              <strong>{club.clubname}</strong> — {club.email}
                          </li>
                      ))}
                  </ul>
              )}
          </section>
      </div>
      <button className="back-button" onClick={() => navigate('/')}>
            Back to Home
        </button>
    </>
  );
};

export default DataBasePage;
