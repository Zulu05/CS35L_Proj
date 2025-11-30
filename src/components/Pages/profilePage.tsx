import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profilePage.css";
import { fetchUsers } from "../../services/user.service";
import User from "../../models/users";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const storedId = localStorage.getItem("userId"); // string | null

      if (!storedId) {
        setError("No logged-in user.");
        return;
      }

      try {
        const users = await fetchUsers();
        const data = users.find((u: any) => u.id === storedId);
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
      <h3>User Information</h3>
      <div className="user-block">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Top matches:</strong> {user.quizResponses?.[0]?.clubMatches?.join(", ") ?? "No matches yet."}
        </p>
      </div>
    </div>
  );
}