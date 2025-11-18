import { useState, useEffect } from 'react'
import './App.css'
import { quizTopics } from './quizTopics'

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    if (selectedTopic) {
      // Get all questions, shuffle them, and take only 10
      const allQuestions = quizTopics[selectedTopic].questions
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, 10)
      setQuestions(selected)
    }
  }, [selectedTopic])

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
      setSelectedTopic(null)
    }
  }

  const selectTopic = (topicKey) => {
    setSelectedTopic(topicKey)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
  }

  // Show topic selection if no topic is selected
  if (!selectedTopic) {
    return (
      <div className="game-container">
        <div className="question-box">
          <h1>Välj Ämne</h1>
          <div className="topic-grid">
            {Object.entries(quizTopics).map(([key, topic]) => (
              <button
                key={key}
                className="topic-card"
                onClick={() => selectTopic(key)}
              >
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return <div className="game-container"><div className="question-box">Loading...</div></div>
  }

  return (
    <div className="game-container">
      <div className="question-box">
        <button className="back-btn" onClick={() => setSelectedTopic(null)}>← Tillbaka till ämnen</button>
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
