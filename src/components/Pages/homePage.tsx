// External Dependencies
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Internal Dependencies
// Frontend
import '../css/homePage.css';

function HomePage() {

const navigate = useNavigate();

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  return (
    <div className="Homepage">
      <h1>The UCLA Student Club Matcher</h1>

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
              const id = localStorage.getItem('userId');
              navigate(id ? '/profile' : '/login');
            }}
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
      <h3>Credits: Team HPGMY</h3>
    </div>
  );
}

export default HomePage;
