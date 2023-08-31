import FlappyDude from './FlappyDude/FlappyDude';

export default function Arcade({overflowContainerRef}) {

    return (
        <div className="bg-slate-500 text-white flex order-first overflow-hidden md:z-20 md:top-0 md:sticky md:h-screen">
            <FlappyDude overflowContainerRef={overflowContainerRef} />
        </div>
    )
}