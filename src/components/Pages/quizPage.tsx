import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './quizPage.css';
import React from 'react';

function QuizPage() {
  const navigate = useNavigate();

  // Question List
  const questions = [
    { text: 'How do you like CS35L?' },
    { text: 'How confident do you feel about the midterm?' },
    { text: 'How excited are you to code a brand new app?' },
  ];

  // Initialize array of answers with same size as questions
  const [answers, setAnswers] = useState(Array(questions.length).fill(50)); // default = 50

  // : number gets rid of a warning and ensures it index must be a number
  const handleSliderChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="quiz-page">
      <h1>Quiz</h1>

      {questions.map((q, i) => (
        <div key={i} className="question-block">
          <p className="question-text">{q.text}</p>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={answers[i]}
              className="slider"
              onChange={(e) => handleSliderChange(i, Number(e.target.value))}
            />
            <span className="slider-value">{answers[i]}</span>
          </div>
        </div>
      ))}

      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
}

export default QuizPage;
