import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './quizPage.css';
import React from 'react';
import{addResult} from "../../services/user.service"

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
    setSubmitError(null);
    const userId = localStorage.getItem('userId');
    console.log(userId)

    if (!userId) {
      setSubmitError('No user id found. Please log in again.');
      return;
    }

    // Build answers dictionary from array and question texts
    const answersDict: { [key: string]: number } = {};
    questions.forEach((q, i) => {
      answersDict[q.text] = answers[i];
    });
    try{
      setSubmitting(true);
      await addResult(userId, answersDict)
      setDisplay(1);
      setAnswers(Array(questions.length).fill(50));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmitError('Failed to submit quiz: ${msg}');
    } finally
    {
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
