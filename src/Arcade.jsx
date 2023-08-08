import { useState, useEffect } from 'react'

function Player({ style }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
            id="player"
            className="w-6 h-6 m-auto -rotate-90 transition-transform origin-center duration-500"
            style={style}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>  
    )
}

function Arcade() {
    const [playerRotation, setPlayerRotation] = useState(0);
    
    let playerStyle = {
        transform: 'rotate(' + playerRotation + 'deg)'
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setPlayerRotation(Math.floor(Math.random() * 360));
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <Player
            style={playerStyle}
        />
    )
}

export default Arcade