export default function GameOverScreen({onClick}) {

    return (
        <div className="w-full h-full relative flex" onClick={onClick}>
            <div className="m-auto text-center">
                <p className="mt-2 text-xl tracking-wide font-arcade">Game Over!</p>
            </div>
        </div>
    )
}