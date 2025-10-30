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
    </div>
  );
}

export default HomePage;