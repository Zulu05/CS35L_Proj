import { useState } from 'react'
import HomePage from './components/Pages/homePage'
import QuizPage from './components/Pages/quizPage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {}
      <div> 
        <HomePage />
        <button onClick={() => { window.location.href = "https://"; }}>Go to Quiz Page</button>
      </div>
    </>
  )
}

export default App
