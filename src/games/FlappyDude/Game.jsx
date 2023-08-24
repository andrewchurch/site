import { useEffect, useRef } from 'react'
import Player from './Player'

const gameConfig = {
    'player': {
        'maxSpeed': 10,
        'gravity': .2,
        'flapSpeed': 10,
    },
};

const initialGameState = {
    'player': {
        'speed': 1,
        'pY': 0
    }
};

export default function Game() {
    let frame = useRef(0);
    let gameState = useRef(initialGameState);
    let gameBoardRef = useRef(null);
    let playerRef = useRef(null);

    function setup() {
        gameState.current.board = {
            'specs': gameBoardRef.current.getBoundingClientRect()
        };
    }

    function applyPlayerGravity() {
        let playerSpeed = gameState.current.player.speed;
        playerSpeed = Math.min(
            playerSpeed + gameConfig.player.gravity,
            gameConfig.player.maxSpeed,
        );
        gameState.current.player.speed = playerSpeed;
    }   

    function updatePlayerPosition() {
        let playerYPosition = gameState.current.player.pY;
        const playerSpeed = gameState.current.player.speed;
        const boardHeight = gameState.current.board.specs.height;

        // if player moves below bottom of board, move them to top
        if (playerYPosition > (boardHeight / 2)) {
            playerYPosition = boardHeight - (boardHeight + (boardHeight / 2));
        
        // player moves above top, move them to bottom
        } else if (playerYPosition < boardHeight - (boardHeight + (boardHeight / 2))) {
            playerYPosition = boardHeight / 2;
        }

        gameState.current.player.pY = playerYPosition + playerSpeed;
    }

    function flap() {
        let playerSpeed = gameState.current.player.speed;
        playerSpeed = Math.max(
            playerSpeed - gameConfig.player.flapSpeed,
            -gameConfig.player.maxSpeed,
        );
        gameState.current.player.speed = playerSpeed;
    }

    function handleBoardClick() {
        flap();
    }

    function draw() {
        playerRef.current.style.transform = 'translateY(' + gameState.current.player.pY + 'px)';
    }

    function tick() {
        applyPlayerGravity();
        updatePlayerPosition();
        draw();
        frame.current = requestAnimationFrame(tick);
    }

    useEffect(() => {
        window.addEventListener('resize', setup); 
        setup();
        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, []);

    return (
        <div className="w-full h-full relative flex" ref={gameBoardRef} onClick={handleBoardClick}>
            <Player ref={playerRef} />
        </div>
    )
}