import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// USER
interface User {
  _id: string;
  username: string;
  email: string;
}

// CLUB
interface Club {
  _id: string;
  username: string;
  email: string;
}

const DataBasePage: React.FC = () => {
    const navigate = useNavigate();

  // States
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [usersError, setUsersError] = useState<string>("");
  const [clubsError, setClubsError] = useState<string>("");
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [clubsLoading, setClubsLoading] = useState<boolean>(true);

  // Fetch Users
  // useEffect(() => {
  //   fetch("/users")
  //     .then(async (res) => {
  //       const data = await res.json();
  //       console.log("DEBUG: /users fetch response:", data);
  //       if (Array.isArray(data)) {
  //         setUsers(data);
  //       } else if (data && Array.isArray(data.users)) {
  //         setUsers(data.users);
  //       } else {
  //         setUsersError("No users found");
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching users:", err);
  //       setUsersError("Error fetching users");
  //     })
  //     .finally(() => setUsersLoading(false));
  // }, []);

  // Fetch Clubs
  // useEffect(() => {
  //   fetch("/clubs")
  //     .then(async (res) => {
  //       const data = await res.json();
  //       console.log("DEBUG: /clubs fetch response:", data);
  //       if (Array.isArray(data)) {
  //         setClubs(data);
  //       } else if (data && Array.isArray(data.clubs)) {
  //         setClubs(data.clubs);
  //       } else {
  //         setClubsError("No clubs found");
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching clubs:", err);
  //       setClubsError("Error fetching clubs");
  //     })
  //     .finally(() => setClubsLoading(false));
  // }, []);

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
                          <li key={user._id}>
                              <strong>{user.username}</strong> — {user.email}
                          </li>
                      ))}
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
                          <li key={club._id}>
                              <strong>{club.username}</strong> — {club.email}
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
