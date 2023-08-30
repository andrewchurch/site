import FlappyDude from '../FlappyDude/FlappyDude';

export default function Arcade() {

    return (
        <div className="bg-slate-500 text-white flex order-first snap-start overflow-hidden md:z-20 md:snap-align-none md:top-0 md:sticky md:h-screen">
            <FlappyDude />
        </div>
    )
}