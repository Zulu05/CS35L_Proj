// External Dependencies
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Internal Dependencies
// Models
import { TraitDefinition } from "../../models/traits";

// Services
import { fetchTraits } from "../../services/traits.service";

// Frontend
import '../css/quizPage.css';

function QuizPage() {
  const navigate = useNavigate();

  const [traits, setTraits] = useState<TraitDefinition[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Extract the top 5 clubs from the results
    const top5 = recJson.results.slice(0, 5);

    // Redirect to the results page, passing top5 along
    navigate("/matches", { state: { top5 } });

    } catch (err: any) {
      setSubmitError(err.message ?? "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <h1>Loading Quiz</h1>
        <p>Loading traits...</p>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h1>Quiz</h1>
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

          <button disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Submitting..." : "Submit"}
          </button>

          {submitError && <p style={{ color: "red" }}>{submitError}</p>}

          <button className="back-button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </>
    </div>
  );
}

export default QuizPage;
