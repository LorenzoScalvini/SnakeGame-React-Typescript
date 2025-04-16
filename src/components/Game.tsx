import React, { useState } from 'react';
import './Game.css';

const Game: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<'menu' | 'playing' | 'paused'>('menu');

  return (
    <div className="game-container">
      <h1>Snake Game</h1>
      
      {gameStatus === 'menu' && (
        <div className="menu">
          <button onClick={() => setGameStatus('playing')}>Play</button>
        </div>
      )}

      {gameStatus === 'playing' && (
        <div className="game-board">
          {/* Game board will go here */}
          <button onClick={() => setGameStatus('paused')}>Pause</button>
        </div>
      )}

      {gameStatus === 'paused' && (
        <div className="pause-menu">
          <h2>Game Paused</h2>
          <button onClick={() => setGameStatus('playing')}>Resume</button>
          <button onClick={() => setGameStatus('menu')}>Main Menu</button>
        </div>
      )}
    </div>
  );
};

export default Game;