import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Welcome to the Quiz App</h1>
      <button onClick={() => navigate('/quiz')}>
        Start Quiz
      </button>

      <h2>What do we do?</h2>
      <p>This is a quiz app that lets you take a quiz to match you with a club at UCLA. To see more information about clubs on campus, click the button below</p>
      <button onClick={() => navigate('/clubinfo')}>
        Club Information
      </button>
      <h3>Credits: us heheheh</h3>
    </div>
  );
}

export default HomePage;