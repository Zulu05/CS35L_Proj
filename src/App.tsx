import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Pages/homePage';
import QuizPage from './components/Pages/quizPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;