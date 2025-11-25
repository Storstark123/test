import { useState, useEffect } from 'react'
import './MemoryGame.css'
import tntImage from './images/tnt.webp'
import pigImage from './images/pig.webp'
import dolphinImage from './images/dolphin.webp'
import rabbitImage from './images/rabbit.webp'
import horseImage from './images/horse.webp'
import wolfImage from './images/wolf.webp'

const MemoryGame = ({ onBack }) => {
  const cardPairs = [
    { id: 1, value: tntImage },
    { id: 2, value: pigImage },
    { id: 3, value: dolphinImage },
    { id: 4, value: rabbitImage },
    { id: 5, value: horseImage },
    { id: 6, value: wolfImage },
  ]

  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Initialize game
  useEffect(() => {
    const shuffledCards = [...cardPairs, ...cardPairs]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }))
    setCards(shuffledCards)
  }, [])

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      
      if (cards[first].value === cards[second].value) {
        setMatched([...matched, cards[first].value])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
      
      setMoves(moves + 1)
    }
  }, [flipped])

  // Check for win
  useEffect(() => {
    if (matched.length === cardPairs.length && matched.length > 0) {
      setGameWon(true)
    }
  }, [matched])

  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(cards[index].value) || gameWon) {
      return
    }

    if (flipped.length < 2) {
      setFlipped([...flipped, index])
    }
  }

  const resetGame = () => {
    const shuffledCards = [...cardPairs, ...cardPairs]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }))
    setCards(shuffledCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  return (
    <div className="game-container">
      <div className="memory-box">
        <button className="back-btn" onClick={onBack}>← Tillbaka till ämnen</button>
        <h1>Memory</h1>
        <p className="memory-stats">Drag: {moves} | Matchade par: {matched.length}/{cardPairs.length}</p>
        
        <div className="memory-grid">
          {cards.map((card, index) => (
            <div
              key={card.uniqueId}
              className={`memory-card ${
                flipped.includes(index) || matched.includes(card.value) ? 'flipped' : ''
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-front"></div>
                <div className="card-back">
                  {typeof card.value === 'string' && card.value.startsWith('http') || card.value.endsWith('.webp') || card.value.endsWith('.jpg') || card.value.endsWith('.png') ? (
                    <img src={card.value} alt="card" className="card-image" />
                  ) : (
                    card.value
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {gameWon && (
          <div className="result-box correct">
            <h2>🎉 Du vann!</h2>
            <p className="result-message">Du löste det på {moves} drag!</p>
            <button className="next-btn" onClick={resetGame}>
              Spela igen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MemoryGame
