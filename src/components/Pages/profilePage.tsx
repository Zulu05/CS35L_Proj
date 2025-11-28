import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profilePage.css';
import React from 'react';

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <h3>User Information</h3>
      <div className="user-block">
        <p><strong>Username:</strong> JaneDoe</p>
        <p><strong>Email:</strong> janedoe@example.com</p>
      </div>
    </div>
  );
}


export default ProfilePage;