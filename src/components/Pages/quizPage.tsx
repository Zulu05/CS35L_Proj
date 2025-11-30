import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './quizPage.css';
import React from 'react';
import{addResult} from "../../services/user.service"
import User from "../../models/users";

function QuizPage() {
  const navigate = useNavigate();

  // Question List
  const questions = [
    { text: 'Social' },
    { text: 'Academic' },
    { text: 'Leadership' },
    { text: 'Creativity' },
  ];

  // Initialize array of answers with same size as questions
  const [answers, setAnswers] = useState(Array(questions.length).fill(50)); // default = 50
  const [display, setDisplay] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // : number gets rid of a warning and ensures it index must be a number
  const handleSliderChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  
  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return setSubmitError('No user id found. Please log in again.');
  
    // Build answers object that matches backend expectation
    const answersObj = {
      social: answers[0],
      academic: answers[1],
      leadership: answers[2],
      creativity: answers[3],
    };

    setSubmitError(null);
    setSubmitting(true);
  
    try {
      // 1) Save quiz answers in the DB
      const saveAnswersResp = await fetch(`/users/${userId}/quiz`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersObj }), 
      });

      if (!saveAnswersResp.ok) {
        const text = await saveAnswersResp.text();
        throw new Error(text || `HTTP ${saveAnswersResp.status}`);
      }

      // 2) Fetch club recommendations based on quiz answers
      const getRecommendationsResp = await fetch(`/recommendations/${userId}/top?limit=5`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!getRecommendationsResp.ok) {
        const text = await getRecommendationsResp.text();
        throw new Error(text || `Failed to fetch recommendations (HTTP ${getRecommendationsResp.status})`);
      }

      const recJson = await getRecommendationsResp.json();
      const clubMatches = recJson.results;

    // 3) Save those recommendations onto the latest quiz response
      const saveRecResp = await fetch(`/users/${userId}/quiz/latest-matches`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubMatches }),
      });

      if (!saveRecResp.ok) {
        const text = await saveRecResp.text();
        throw new Error(text || `Failed to save recommendations (HTTP ${saveRecResp.status})`);
      }
  
      setDisplay(1); // show results
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmitError(`Failed to submit: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="quiz-page">
      <h1>Quiz</h1>

      {!display ? (
        <>
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
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          {submitError && (
            <div style={{ marginTop: 12, color: 'crimson' }}>
              {submitError}
            </div>
          )}
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </>
      ) : (
        <>
          <h2>Your Answers:</h2>
          <ol>
            {answers.map((val, i) => (
              <li key={i}>
                <strong>{questions[i].text}</strong> → {val}
              </li>
            ))}
          </ol>
          <button className="back-button" onClick={() => setDisplay(0)}>
            Return to Quiz
          </button>
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </>
      )}
    </div>
  );
}


export default QuizPage;
