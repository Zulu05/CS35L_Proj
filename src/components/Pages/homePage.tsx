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
import './homePage.css';

function HomePage() {

const navigate = useNavigate();

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
              localStorage.removeItem('userName');
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
    </div>
  );
}

export default HomePage;
