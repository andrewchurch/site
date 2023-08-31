import { useEffect, useRef } from 'react'
import { Player } from './Player'

export default function StartScreen({startGame}) {
    const playerRef = useRef(null);

    function playerFlapAnimation() {

        // flap at a random time between 500 and 1000 ms
        const randomInterval = Math.floor(Math.random() * (1000 - 500) + 500);
        setTimeout(() => {
            playerRef.current && playerRef.current.classList.add('flap');
            playerFlapAnimation();
            setTimeout(() => {
                playerRef.current && playerRef.current.classList.remove('flap');
            }, 100);
        }, randomInterval);
    }

    useEffect(() => {
        playerFlapAnimation();
    }, []);

    return (
        <div className="w-full h-full relative flex cursor-pointer" onClick={startGame}>
            <div className="m-auto text-center">
                <h2 className="mb-2 text-2xl tracking-wide font-arcade">Flappy Dude</h2>
                <Player ref={playerRef} />
                <p className="mt-6 text-base tracking-wide font-arcade">Click/Tap to Start</p>
            </div>
        </div>
    )
}