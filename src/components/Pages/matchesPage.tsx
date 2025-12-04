// External Dependencies
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Internal Dependencies
// Frontend
import "../css/matchesPage.css";

export default function MatchesPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const top5 = state?.top5 ?? [];

  return (
    <div className="matches-page">
      <h1 className="matches-title">Your Top UCLA Club Matches</h1>
      <p className="matches-subtitle">
        Based on your interests and preferences
      </p>

      {top5.length === 0 ? (
        <p className="no-matches">No matches found — try taking the quiz again.</p>
      ) : (
        <div className="matches-list">
          {top5.map((club: { clubId: string; clubname: string; matchPercent: number }, index: number) => (
            <div key={club.clubId} className="match-card">
              <div className="match-rank">#{index + 1}</div>

              <div className="match-content">
                <h2 className="match-name">{club.clubname}</h2>

                <div className="match-bar-container">
                  <div
                    className="match-bar-fill"
                    style={{ width: `${club.matchPercent}%` }}
                  ></div>
                </div>

                <p className="match-percent">
                  {club.matchPercent}% Match
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
      <button className="back-quiz-button" onClick={() => navigate("/quiz")}>
        Retake Quiz
      </button>
    </div>
  );
}
