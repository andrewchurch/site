import { useState } from 'react'
import StartScreen from './Start';
import Game from './Game';
import GameOverScreen from './GameOver';

export default function FlappyDude() {
    const [gameMode, setGameMode] = useState('start');

    return (
        <>
            {gameMode === 'start' && 
                <StartScreen onClick={() => setGameMode('playing') } />
            }
            {gameMode === 'playing' && 
                <Game endGame={() => setGameMode('end')}/>
            }
            {gameMode === 'end' && 
                <GameOverScreen onClick={() => setGameMode('start') } />
            }
        </>
    )
}