// Importa React e gli hook necessari, oltre al file CSS per lo stile
import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';

// Definizione del tipo per rappresentare una posizione sulla griglia
type Position = {
  x: number;
  y: number;
};

// Costanti per configurare il gioco
const GRID_SIZE = 20; // Dimensione della griglia (20x20)
const CELL_SIZE = 20; // Dimensione di ogni cella in pixel
const INITIAL_SPEED = 150; // Velocità iniziale del serpente in millisecondi

// Componente principale del gioco
const Game: React.FC = () => {
  // Stati per gestire lo stato del gioco, il serpente, il cibo, la direzione, ecc.
  const [gameStatus, setGameStatus] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]); // Posizione iniziale del serpente
  const [food, setFood] = useState<Position>({ x: 5, y: 5 }); // Posizione iniziale del cibo
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT'); // Direzione iniziale
  const [speed, setSpeed] = useState(INITIAL_SPEED); // Velocità del serpente
  const [score, setScore] = useState(0); // Punteggio attuale
  const [highScore, setHighScore] = useState(0); // Punteggio massimo
  const [touchStart, setTouchStart] = useState<Position | null>(null); // Per controlli touch
  const [touchEnd, setTouchEnd] = useState<Position | null>(null);

  // Funzione per generare una posizione casuale per il cibo
  const generateFood = useCallback((): Position => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  // Funzione per verificare se una posizione è occupata dal serpente
  const isPositionOccupied = useCallback((pos: Position, snakeBody: Position[] = snake): boolean => {
    return snakeBody.some(segment => segment.x === pos.x && segment.y === pos.y);
  }, [snake]);

  // Funzione per resettare lo stato del gioco
  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]); // Ripristina il serpente alla posizione iniziale
    setDirection('RIGHT'); // Ripristina la direzione iniziale
    setSpeed(INITIAL_SPEED); // Ripristina la velocità iniziale
    setScore(0); // Resetta il punteggio

    // Genera una nuova posizione per il cibo, assicurandosi che non sia occupata dal serpente
    let newFood = generateFood();
    while (isPositionOccupied(newFood, [{ x: 10, y: 10 }])) {
      newFood = generateFood();
    }
    setFood(newFood);
  }, [generateFood, isPositionOccupied]);

  // Gestione degli input da tastiera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;

      // Cambia direzione in base alla freccia premuta, evitando movimenti opposti
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setGameStatus('paused'); // Pausa il gioco se si preme la barra spaziatrice
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, direction]);

  // Ciclo principale del gioco
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] }; // Copia la testa del serpente

        // Aggiorna la posizione della testa in base alla direzione
        switch (direction) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Controlla collisioni con i bordi
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameStatus('gameOver'); // Fine del gioco
          setHighScore(prev => Math.max(prev, score)); // Aggiorna il punteggio massimo
          return prevSnake;
        }

        // Controlla collisioni con il corpo del serpente
        if (isPositionOccupied(head, prevSnake)) {
          setGameStatus('gameOver');
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake]; // Aggiunge la nuova testa

        // Controlla collisioni con il cibo
        if (head.x === food.x && head.y === food.y) {
          let newFood = generateFood();
          while (isPositionOccupied(newFood, newSnake)) {
            newFood = generateFood();
          }
          setFood(newFood); // Genera nuovo cibo
          setScore(prev => prev + 10); // Incrementa il punteggio
          setSpeed(prev => Math.max(prev - 5, 50)); // Aumenta la velocità
        } else {
          newSnake.pop(); // Rimuove l'ultimo segmento se non ha mangiato
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, speed); // Esegue il movimento a intervalli regolari
    return () => clearInterval(gameInterval); // Pulisce l'intervallo quando il componente si smonta
  }, [gameStatus, direction, food, generateFood, isPositionOccupied, score]);

  // Gestione dei controlli touch per dispositivi mobili
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || gameStatus !== 'playing') return;

    const xDiff = touchStart.x - touchEnd.x;
    const yDiff = touchStart.y - touchEnd.y;

    // Determina la direzione dello swipe
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // Swipe orizzontale
      if (xDiff > 0 && direction !== 'RIGHT') {
        setDirection('LEFT');
      } else if (xDiff < 0 && direction !== 'LEFT') {
        setDirection('RIGHT');
      }
    } else {
      // Swipe verticale
      if (yDiff > 0 && direction !== 'DOWN') {
        setDirection('UP');
      } else if (yDiff < 0 && direction !== 'UP') {
        setDirection('DOWN');
      }
    }
  };

  // Funzione per avviare il gioco
  const startGame = () => {
    resetGame();
    setGameStatus('playing');
  };

  // Render del componente
  return (
    <div className="game-container">
      <h1>Snake Game</h1>
      
      {/* Menu principale */}
      {gameStatus === 'menu' && (
        <div className="menu">
          <p>High Score: {highScore}</p>
          <button onClick={startGame}>Play</button>
        </div>
      )}

      {/* Punteggio durante il gioco */}
      {gameStatus !== 'menu' && gameStatus !== 'gameOver' && (
        <div className="score">Score: {score}</div>
      )}

      {/* Area di gioco */}
      {gameStatus !== 'menu' && gameStatus !== 'gameOver' && (
        <div 
          className="game-board" 
          style={{ 
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Cibo */}
          <div 
            className="food" 
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE
            }}
          />
          
          {/* Serpente */}
          {snake.map((segment, index) => (
            <div 
              key={index}
              className={`snake-segment ${index === 0 ? 'snake-head' : ''}`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE
              }}
            />
          ))}

          {/* Overlay di pausa */}
          {gameStatus === 'paused' && (
            <div className="pause-overlay">
              <div className="pause-menu">
                <h2>Game Paused</h2>
                <button onClick={() => setGameStatus('playing')}>Resume</button>
                <button onClick={() => {
                  setGameStatus('menu');
                  resetGame();
                }}>Main Menu</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schermata di game over */}
      {gameStatus === 'gameOver' && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your score: {score}</p>
          <p>High score: {highScore}</p>
          <button onClick={startGame}>Play Again</button>
          <button onClick={() => {
            setGameStatus('menu');
            resetGame();
          }}>Main Menu</button>
        </div>
      )}

      {/* Controlli per dispositivi mobili */}
      {gameStatus === 'playing' && (
        <>
          <button className="pause-button" onClick={() => setGameStatus('paused')}>
            Pause
          </button>
          <div className="mobile-controls">
            <button 
              className="up-button"
              onClick={() => direction !== 'DOWN' && setDirection('UP')}
            >
              ↑
            </button>
            <button 
              className="left-button"
              onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
            >
              ←
            </button>
            <button 
              className="down-button"
              onClick={() => direction !== 'UP' && setDirection('DOWN')}
            >
              ↓
            </button>
            <button 
              className="right-button"
              onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
            >
              →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Esporta il componente
export default Game; 