import { useState } from 'react'
import StartScreen from './Start';
import Game from './Game';
import GameOverScreen from './GameOver';

export default function FlappyDude() {
    const [gameMode, setGameMode] = useState('start');
    const [score, setScore] = useState(0);

    return (
        <>
            {gameMode === 'start' && 
                <StartScreen onClick={() => setGameMode('playing') } />
            }
            {gameMode === 'playing' && 
                <Game endGame={(score) => {
                    setScore(score);
                    setGameMode('end');
                }} />
            }
            {gameMode === 'end' && 
                <GameOverScreen score={score} onClick={() => setGameMode('start') } />
            }
        </>
    )
}