import { Player } from './Player'

export default function StartScreen({onClick}) {

    return (
        <div className="w-full h-full relative flex" onClick={onClick}>
            <div className="m-auto text-center">
                <h2 className="mb-2 text-2xl tracking-wide font-arcade">Flappy Dude</h2>
                <Player />
                <p className="mt-6 text-base tracking-wide font-arcade">Click/Tap to Start</p>
            </div>
        </div>
    )
}