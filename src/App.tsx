import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/Pages/homePage';
import QuizPage from './components/Pages/quizPage';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/quiz">Quiz</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;