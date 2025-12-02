import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './quizPageGPT.css';
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
    { text: 'Time Commitment'}
  ];

  const [display, setDisplay] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  //Deal with Major separately
  const majorOptions = ["Arts", "Business", "Computer Science", "Life Sciences", "Social Sciences", "Physical Sciences", "Engineering"];
  const [major, setMajor] = useState<string>("Computer Science");  // default 
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
      timeCommitment: answers[4],
      major_area: major,
    };

    setSubmitError(null);
    setSubmitting(true);

    try { //TODO: Create service function for this instead
      // Save answers
      const saveAnswersResp = await fetch(`/users/${userId}/quiz`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArray }),
      });

      if (!saveAnswersResp.ok) {
        throw new Error(await saveAnswersResp.text());
      }

      // Fetch recommendations
      const recResp = await fetch(`/recommendations/${userId}/all`);
      const recJson = await recResp.json();

      // Save recommendations
      await fetch(`/users/${userId}/quiz/latest-matches`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubMatches: recJson.results }),
      });

      setDisplay(1);
    } catch (err: any) {
      setSubmitError(err.message ?? "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <h1>Quiz</h1>
        <p>Loading traits...</p>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h1>Quiz</h1>

      {!display ? (
        <>
          {traits.map((trait, index) => (
            <div key={trait.id} className="question-block">
              <p className="question-subtext">{trait.questionText}</p>
              <div className="slider-container">
                <div className="slider-header">
                  <div className="label-left">
                    <span className="label-text">{trait.labelLeft}</span>
                    <span className="label-percent">({100-answers[index]}%)</span>
                  </div>
                  <div className="slider-track-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={answers[index]}
                    onChange={(e) =>
                      handleSliderChange(index, Number(e.target.value))
                    }
                    className="slider"
                    style={{
                      background: `linear-gradient(90deg, #c8f5ce ${answers[index]}%, #e9e9e9 ${answers[index]}%)`,
                    }}
                  />
                </div>
                  <div className="label-right">
                    <span className="label-percent">({answers[index]}%)</span>
                    <span className="label-text">{trait.labelRight}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="question-block">
          <p className="question-text">What area best fits your major?</p>

          <select
            className="major-select"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          >
            {majorOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>

          {submitError && <p style={{ color: "red" }}>{submitError}</p>}

          <button className="back-button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </>
      ) : (
        <>
          <h2>Your Answers:</h2>
          <ol>
            {traits.map((trait, i) => (
              <li key={trait.id}>
                <strong>{trait.labelLeft} {trait.labelRight}:</strong>{" "}
                {answers[i]}
              </li>
            ))}
            <strong>Major Area</strong> → {major}
          </ol>

          <button onClick={() => setDisplay(0)}>Return to Quiz</button>
          <button onClick={() => navigate("/")}>Back to Home</button>
        </>
      )}
    </div>
  );
}

export default QuizPage;
