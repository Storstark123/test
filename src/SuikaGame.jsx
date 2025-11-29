import { useState, useEffect, useRef } from 'react'
import './SuikaGame.css'

const DuckHuntingGame = ({ onBack }) => {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const gameStateRef = useRef({
    ducks: [],
    score: 0,
    timeLeft: 30,
    gameOver: false,
    canShoot: true,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    gameStateRef.current.timeLeft = 30
    setTime(30)

    // Duck generation
    const spawnDuck = () => {
      if (!gameStateRef.current.gameOver) {
        const x = Math.random() * (width - 80)
        const y = Math.random() * (height - 60)
        const vx = (Math.random() - 0.5) * 1.5
        const vy = (Math.random() - 0.5) * 1.5
        
        gameStateRef.current.ducks.push({
          x,
          y,
          vx,
          vy,
          width: 80,
          height: 60,
          alive: true,
        })
      }
    }

    // Spawn ducks every 1500ms (slower)
    const spawnInterval = setInterval(spawnDuck, 1500)

    // Game timer
    const timerInterval = setInterval(() => {
      gameStateRef.current.timeLeft -= 1
      setTime(gameStateRef.current.timeLeft)
      
      if (gameStateRef.current.timeLeft <= 0) {
        gameStateRef.current.gameOver = true
        setGameOver(true)
        clearInterval(spawnInterval)
        clearInterval(timerInterval)
      }
    }, 1000)

    // Game loop
    const gameLoop = () => {
      ctx.fillStyle = 'linear-gradient(180deg, #87ceeb 0%, #e0f6ff 100%)'
      ctx.fillRect(0, 0, width, height)

      // Draw grass at bottom
      ctx.fillStyle = '#228b22'
      ctx.fillRect(0, height - 80, width, 80)

      // Draw and update ducks
      gameStateRef.current.ducks.forEach((duck, index) => {
        if (!duck.alive) return

        // Update position
        duck.x += duck.vx
        duck.y += duck.vy

        // Bounce off walls
        if (duck.x < 0 || duck.x + duck.width > width) duck.vx *= -1
        if (duck.y < 0 || duck.y + duck.height > height - 80) duck.vy *= -1

        // Keep in bounds
        duck.x = Math.max(0, Math.min(duck.x, width - duck.width))
        duck.y = Math.max(0, Math.min(duck.y, height - 80 - duck.height))

        // Draw duck
        ctx.save()
        ctx.translate(duck.x + duck.width / 2, duck.y + duck.height / 2)
        if (duck.vx < 0) ctx.scale(-1, 1)
        ctx.translate(-(duck.width / 2), -(duck.height / 2))

        // Duck body (yellow circle)
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.arc(duck.width / 2, duck.height / 2, 15, 0, Math.PI * 2)
        ctx.fill()

        // Duck head (smaller yellow circle)
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.arc(duck.width / 2 + 12, duck.height / 2 - 10, 10, 0, Math.PI * 2)
        ctx.fill()

        // Duck eye
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(duck.width / 2 + 17, duck.height / 2 - 12, 3, 0, Math.PI * 2)
        ctx.fill()

        // Duck beak
        ctx.strokeStyle = 'orange'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(duck.width / 2 + 20, duck.height / 2 - 10)
        ctx.lineTo(duck.width / 2 + 28, duck.height / 2 - 10)
        ctx.stroke()

        ctx.restore()
      })

      // Remove dead ducks from array
      gameStateRef.current.ducks = gameStateRef.current.ducks.filter(d => d.alive)

      // Draw score
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(10, 10, 200, 60)
      ctx.fillStyle = 'white'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`Poäng: ${gameStateRef.current.score}`, 20, 40)
      ctx.font = '16px Arial'
      ctx.fillText(`Tid: ${gameStateRef.current.timeLeft}s`, 20, 60)

      // Draw ducks left
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(width - 200, 10, 190, 60)
      ctx.fillStyle = 'white'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'right'
      ctx.fillText(`Änder: ${gameStateRef.current.ducks.filter(d => d.alive).length}`, width - 20, 40)

      if (!gameStateRef.current.gameOver) {
        requestAnimationFrame(gameLoop)
      }
    }

    gameLoop()

    return () => {
      clearInterval(spawnInterval)
      clearInterval(timerInterval)
    }
  }, [])

  const handleCanvasClick = (e) => {
    if (gameOver || gameStateRef.current.gameOver) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Check if clicked on a duck with expanded hit area
    gameStateRef.current.ducks.forEach((duck) => {
      if (
        duck.alive &&
        clickX >= duck.x - 15 &&
        clickX <= duck.x + duck.width + 15 &&
        clickY >= duck.y - 15 &&
        clickY <= duck.y + duck.height + 15
      ) {
        duck.alive = false
        gameStateRef.current.score += 10
        setScore(gameStateRef.current.score)
      }
    })

    // Draw shot effect
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(255, 100, 100, 0.6)'
    ctx.beginPath()
    ctx.arc(clickX, clickY, 25, 0, Math.PI * 2)
    ctx.fill()
  }

  const resetGame = () => {
    gameStateRef.current.ducks = []
    gameStateRef.current.score = 0
    gameStateRef.current.timeLeft = 30
    gameStateRef.current.gameOver = false
    setScore(0)
    setTime(30)
    setGameOver(false)
    window.location.reload() // Reload to restart the game properly
  }

  return (
    <div className="game-container">
      <div className="suika-box">
        <button className="back-btn" onClick={onBack}>← Tillbaka till ämnen</button>
        <h1>🦆 Andskjutning</h1>
        <p className="suika-instructions">Klicka på andarna för att skjuta dem! Du har 30 sekunder.</p>
        
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          onClick={handleCanvasClick}
          className="suika-canvas"
          style={{ cursor: 'crosshair' }}
        />

        {gameOver && (
          <div className="result-box correct">
            <h2>🎮 Spelet är slut!</h2>
            <p className="result-message">Slutlig Poäng: {score}</p>
            <button className="next-btn" onClick={resetGame}>
              Spela igen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DuckHuntingGame
