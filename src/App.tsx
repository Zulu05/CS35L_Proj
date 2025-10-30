import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Pages/homePage';
import QuizPage from './components/Pages/quizPage';
import ClubInfoPage from './components/Pages/clubInfoPage';
import './App.css';
import React from 'react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/clubInfo" element={<ClubInfoPage />} />
      </Routes>
    </Router>

  );
}

export default App;