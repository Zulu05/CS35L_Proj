import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./quizPage.css";
import { fetchTraits } from "../../services/traits.service";
import { TraitDefinition } from "../../models/traits";

function QuizPage() {
  const navigate = useNavigate();

  const [traits, setTraits] = useState<TraitDefinition[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [display, setDisplay] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const t = await fetchTraits();
      console.log("Fetched traits:", t);

      setTraits(t);
      setAnswers(Array(t.length).fill(50));
      setLoading(false);
    })();
  }, []);

  const handleSliderChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return setSubmitError('No user id found. Please log in again.');

    if (!traits.length) {
      return setSubmitError("No traits are configured yet. Try again later.");
    }

    const answersArray = traits.map((trait, index) => ({
      traitId: trait.id,
      value: answers[index],
    }));

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
              <p className="question-text">
                {trait.labelLeft} ↔ {trait.labelRight}
              </p>
              <p className="question-subtext">{trait.questionText}</p>

              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={answers[index]}
                  onChange={(e) =>
                    handleSliderChange(index, Number(e.target.value))
                  }
                />
                <span className="slider-value">{answers[index]}</span>
              </div>
            </div>
          ))}

          <button disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Submitting..." : "Submit"}
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
                <strong>{trait.labelLeft} ↔ {trait.labelRight}:</strong>{" "}
                {answers[i]}
              </li>
            ))}
          </ol>

          <button onClick={() => setDisplay(0)}>Return to Quiz</button>
          <button onClick={() => navigate("/")}>Back to Home</button>
        </>
      )}
    </div>
  );
}

export default QuizPage;
