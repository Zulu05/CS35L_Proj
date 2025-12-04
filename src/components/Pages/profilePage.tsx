// External Dependencies
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Internal Dependencies
// Models
import User from "../../models/users";
import { fetchUsers } from "../../services/user.service";

// Frontend
import "../css/profilePage.css";


export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null; // string | null

      if (!userId) {
        setError("No logged-in user.");
        return;
      }

      try {
        const users = await fetchUsers();
        const data = users.find((u: any) => u.id === userId);
        // if getUserById returns a class instance, you can still store it in state
        if (!data) {
          setError("User not found.");
          return;
        }
        setUser(data as User);
      } catch (err) {
        console.error(err);
        setError("Failed to load user profile.");
      }
    }

    loadUser();
  }, []);

  if (error) {
    return (
      <div className="profile-page">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <p>Loading...</p>
      </div>
    );
  }

return (
  <div className="profile-page">
    <h1>Profile</h1>

    <div className="user-block">
      <p>
        <strong>Username:</strong> {user.username}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <div className="matches-section">
        <p>
        </p>
        <strong>Top Matches</strong>
        <br />

        {user.latestClubMatches && user.latestClubMatches.length > 0 ? (
          <ol className="matches-list">
            {user.latestClubMatches.slice(0, 5).map((m: any, idx: number) => (
              <li key={idx}>
                {m.clubname} ({m.matchPercent}%)
              </li>
            ))}
          </ol>
        ) : (
          <p>No matches yet.</p>
        )}
      </div>
    </div>
  </div>
);
}