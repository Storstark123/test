import { useState, useEffect, useRef } from 'react'
import './SuikaGame.css'

const SuikaGame = ({ onBack }) => {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [nextFruit, setNextFruit] = useState(null)
  const gameStateRef = useRef({
    fruits: [],
    nextFruitType: 0,
    score: 0,
    gameOver: false,
    mouseX: 0,
    mouseY: 0,
  })

  const fruits = [
    { size: 20, emoji: '🍒', points: 10, color: '#ff6b6b' },
    { size: 25, emoji: '🍌', points: 15, color: '#ffd43b' },
    { size: 30, emoji: '🍊', points: 20, color: '#ff922b' },
    { size: 35, emoji: '🍎', points: 30, color: '#e03131' },
    { size: 40, emoji: '🍑', points: 40, color: '#f76707' },
    { size: 45, emoji: '🍉', points: 50, color: '#51cf66' },
    { size: 50, emoji: '🍇', points: 60, color: '#7950f2' },
    { size: 60, emoji: '🍓', points: 100, color: '#e64980' },
    { size: 70, emoji: '🍍', points: 150, color: '#fab005' },
    { size: 80, emoji: '🍌', points: 200, color: '#ffd43b' },
    { size: 90, emoji: '🍎', points: 300, color: '#e03131' },
  ]

  const dropFruit = (x) => {
    const fruit = fruits[gameStateRef.current.nextFruitType]
    gameStateRef.current.fruits.push({
      x: Math.max(fruit.size, Math.min(x, 340 - fruit.size)),
      y: 20,
      vx: 0,
      vy: 0,
      type: gameStateRef.current.nextFruitType,
      merged: false,
    })

    gameStateRef.current.nextFruitType = Math.floor(Math.random() * Math.min(5, fruits.length))
    setNextFruit(gameStateRef.current.nextFruitType)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const gravity = 0.3
    const friction = 0.98

    gameStateRef.current.nextFruitType = 0
    setNextFruit(0)

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw game area
      ctx.fillStyle = 'rgba(240, 240, 240, 0.5)'
      ctx.fillRect(0, 0, width, height)
      ctx.strokeStyle = '#0369a1'
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, width, height)

      // Physics simulation
      gameStateRef.current.fruits.forEach((fruit) => {
        fruit.vy += gravity
        fruit.vy *= friction
        fruit.vx *= friction
        fruit.x += fruit.vx
        fruit.y += fruit.vy

        // Wall collisions
        const fruitData = fruits[fruit.type]
        if (fruit.x - fruitData.size < 0) {
          fruit.x = fruitData.size
          fruit.vx *= -0.5
        }
        if (fruit.x + fruitData.size > width) {
          fruit.x = width - fruitData.size
          fruit.vx *= -0.5
        }

        // Floor collision
        if (fruit.y + fruitData.size > height) {
          fruit.y = height - fruitData.size
          fruit.vy *= -0.3

          // Game over if fruit goes off top
          if (fruit.y < 50) {
            gameStateRef.current.gameOver = true
          }
        }
      })

      // Collision detection between fruits
      for (let i = 0; i < gameStateRef.current.fruits.length; i++) {
        for (let j = i + 1; j < gameStateRef.current.fruits.length; j++) {
          const f1 = gameStateRef.current.fruits[i]
          const f2 = gameStateRef.current.fruits[j]

          const d1 = fruits[f1.type].size
          const d2 = fruits[f2.type].size
          const dx = f2.x - f1.x
          const dy = f2.y - f1.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = d1 + d2

          if (dist < minDist && f1.type === f2.type && f1.type < fruits.length - 1) {
            // Merge fruits
            const newType = f1.type + 1
            const newFruit = fruits[newType]
            const newFruitObj = {
              x: (f1.x + f2.x) / 2,
              y: (f1.y + f2.y) / 2,
              vx: (f1.vx + f2.vx) / 2,
              vy: (f1.vy + f2.vy) / 2,
              type: newType,
              merged: false,
            }

            gameStateRef.current.fruits.splice(j, 1)
            gameStateRef.current.fruits.splice(i, 1)
            gameStateRef.current.fruits.push(newFruitObj)

            gameStateRef.current.score += newFruit.points
            setScore(gameStateRef.current.score)
            break
          }
        }
      }

      // Draw fruits
      gameStateRef.current.fruits.forEach((fruit) => {
        const fruitData = fruits[fruit.type]
        ctx.font = `${fruitData.size * 2}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(fruitData.emoji, fruit.x, fruit.y)
      })

      // Draw next fruit preview
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, 100, 60)
      ctx.fillStyle = 'white'
      ctx.font = '14px Arial'
      ctx.textAlign = 'left'
      ctx.fillText('Próximo:', 10, 20)
      const nextFruitData = fruits[gameStateRef.current.nextFruitType]
      ctx.font = `${nextFruitData.size}px Arial`
      ctx.fillText(nextFruitData.emoji, 50, 45)

      // Draw score
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(width - 150, 0, 150, 60)
      ctx.fillStyle = 'white'
      ctx.font = '14px Arial'
      ctx.textAlign = 'right'
      ctx.fillText('Puntuación:', width - 10, 20)
      ctx.font = 'bold 20px Arial'
      ctx.fillText(gameStateRef.current.score, width - 10, 45)

      if (!gameStateRef.current.gameOver) {
        requestAnimationFrame(gameLoop)
      } else {
        setGameOver(true)
      }
    }

    gameLoop()
  }, [])

  const handleCanvasClick = (e) => {
    if (gameOver || gameStateRef.current.gameOver) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    dropFruit(x)
  }

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    gameStateRef.current.mouseX = e.clientX - rect.left
  }

  const resetGame = () => {
    gameStateRef.current.fruits = []
    gameStateRef.current.score = 0
    gameStateRef.current.gameOver = false
    gameStateRef.current.nextFruitType = 0
    setScore(0)
    setGameOver(false)
    setNextFruit(0)
  }

  return (
    <div className="game-container">
      <div className="suika-box">
        <button className="back-btn" onClick={onBack}>← Tillbaka till ämnen</button>
        <h1>Suika Game</h1>
        <p className="suika-instructions">Haz clic para soltar frutas. ¡Combina frutas iguales para obtener las más grandes!</p>
        
        <canvas
          ref={canvasRef}
          width={340}
          height={500}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          className="suika-canvas"
        />

        {gameOver && (
          <div className="result-box correct">
            <h2>🎮 Juego Terminado</h2>
            <p className="result-message">Puntuación Final: {score}</p>
            <button className="next-btn" onClick={resetGame}>
              Jugar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuikaGame
