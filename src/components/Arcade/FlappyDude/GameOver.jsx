import Scoreboard from './Scoreboard';

export default function GameOverScreen({backToStart, score}) {

    return (
        <div className="w-full h-full relative flex cursor-pointer" onClick={backToStart}>
            <div className="m-auto text-center">
                <p className="mt-2 mb-6 text-xl tracking-wide font-arcade">
                    Game Over! Your Score: {score}
                </p>
                <Scoreboard score={score} />
                <p className="mt-6 text-xl tracking-wide font-arcade">
                    Click/Tap to Play Again
                </p>
            </div>
        </div>
    )
}