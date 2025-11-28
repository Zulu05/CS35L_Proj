import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Pages/homePage';
import QuizPage from './components/Pages/quizPage';
import ClubInfoPage from './components/Pages/clubInfoPage';
import DataBasePage from './components/Pages/databasePage';
import './App.css';
import React, { useEffect, useState } from 'react';


function App() {
  //backend stuff <3 <3 <3

  //frontend stuff <3 <3 <3
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/clubInfo" element={<ClubInfoPage />} />
        <Route path="/dataBase" element={<DataBasePage />} />
      </Routes>
    </Router>
  );
}

export default App;