// External Dependencies
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Internal Dependencies
import HomePage from './components/Pages/homePage';
import QuizPage from './components/Pages/quizPage';
import MatchesPage from './components/Pages/matchesPage';
import LoginPage from './components/Pages/loginPage';
import SignUpPage from './components/Pages/signUpPage';
import ClubInfoPage from './components/Pages/clubInfoPage';
import DataBasePage from './components/Pages/databasePage';
import ProfilePage from './components/Pages/profilePage';
import AdminPage from './components/Pages/adminPage';
import Banner from './components/Pages/banner';

// Frontend
import './App.css';


function App() {
  return ( 
    <>
    <Banner/>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/clubInfo" element={<ClubInfoPage />} />
        <Route path="/database" element={<DataBasePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default App;