import { useState, useEffect } from 'react'
import './App.css'
import { questionsDatabase } from './questionsDatabase'

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    // Shuffle questions on component mount
    const shuffled = [...questionsDatabase].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
  }, [])

  const handleAnswer = (index) => {
    const correct = index === questions[currentQuestion].correct
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    setShowResult(false)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      alert(`Game Over! Final Score: ${score}/${questions.length}`)
      setCurrentQuestion(0)
      setScore(0)
      // Reshuffle questions for next game
      const shuffled = [...questionsDatabase].sort(() => Math.random() - 0.5)
      setQuestions(shuffled)
    }
  }

  if (questions.length === 0) {
    return <div className="game-container"><div className="question-box">Loading...</div></div>
  }

  return (
    <div className="game-container">
      <div className="question-box">
        {!showResult ? (
          <>
            <h2>Fråga {currentQuestion + 1}/{questions.length}</h2>
            <p className="question">{questions[currentQuestion].question}</p>
            <div className="answers">
              {questions[currentQuestion].answers.map((answer, index) => (
                <button 
                  key={index} 
                  className="answer-btn"
                  onClick={() => handleAnswer(index)}
                >
                  {answer}
                </button>
              ))}
            </div>
            <p className="score">Poäng: {score}</p>
          </>
        ) : (
          <>
            <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
              <h2>{isCorrect ? '✓ RÄTT RÄTT RÄTT!' : '✗ FEL FEL FEL!'}</h2>
              <p className="result-message">
                {isCorrect 
                  ? 'Bubbis är så duktig!' 
                  : `Rätt var: ${questions[currentQuestion].answers[questions[currentQuestion].correct]}`
                }
              </p>
              <button className="next-btn" onClick={handleNext}>
                {currentQuestion < questions.length - 1 ? 'Nästa fråga' : 'Finish'}
              </button>
            </div>
            <p className="score">Poäng: {score}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default App
