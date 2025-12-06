// External Dependncies
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Internal Dependencies
// Models
import User from "../../models/users";
import Club from "../../models/clubs";

// Services
import { fetchUsers } from "../../services/users.service";
import { fetchClubs } from "../../services/club.service";

//login page
import AdminLogin from './adminLogin';
const DataBasePage: React.FC = () => {
  const navigate = useNavigate();
  //login variables
  const[isAdmin, setIsAdmin] = useState(false);

  // States
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [usersError, setUsersError] = useState<string>("");
  const [clubsError, setClubsError] = useState<string>("");
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
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
        setUsersError(`error fetching users: ${err}`);
      } finally{
        setUsersLoading(false);
      }
    })();
  }, []);

  // getting clubs
  useEffect(()=>{
    (async () => {
      try{
        setClubsLoading(true);
        const data = await fetchClubs();
        setClubs(data);
      }
      catch (err){
        setClubsError(`error fetching clubs: ${err}`);
      } finally
      {
        setClubsLoading(false);
      }
    })();
  }, []);

  return (
    <>
    {!isAdmin?(<AdminLogin setIsAdmin={setIsAdmin}/>):(
      <>
      <div>
        <h1>Library</h1>
        {/* USERS */}
        <section>
          <h2>Users</h2>
          {usersError && <p style={{ color: "red" }}>{usersError}</p>}
          {usersLoading && !usersError && <p>Loading users...</p>}
          {!usersLoading && users.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {users.map((user) => {
                const lastQuiz =
                  user.quizResponses && user.quizResponses.length > 0
                    ? user.quizResponses[user.quizResponses.length - 1]
                    : undefined; 
                return (
                  <li key={user.id?.toString()}>
                    <strong>{user.username}</strong> — {user.email}
                    {/* USER RESULTS */}
                    {lastQuiz ? (
                      <div
                        style={{ marginTop: "8px", marginLeft: "20px" }}
                      >
                        <em>Last Quiz Results:</em>
                        <ul
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          <li>Social: {lastQuiz.answers.social}</li>
                          <li>Academic: {lastQuiz.answers.academic}</li>
                          <li>Leadership: {lastQuiz.answers.leadership}</li>
                          <li>Creativity: {lastQuiz.answers.creativity}</li>
                        </ul>

                        <div
                          style={{
                            marginTop: "5px",
                            fontSize: "0.9rem",
                          }}
                        >
                          <strong>Matches:</strong>{" "}
                          {user.latestClubMatches && user.latestClubMatches.length > 0
                            ? user.latestClubMatches
                                .map((m: any) => `${m.clubname} (${m.matchPercent}%)`)
                                .join(", ")
                            : "None"}
                        </div>
                        
                      </div>
                    ) : (
                      <p
                        style={{
                          marginLeft: "20px",
                          fontSize: "0.9rem",
                        }}
                      >
                        No quiz submitted.
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

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

      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
      </>
    )}
    </>
  );
};

export default DataBasePage;