import { forwardRef } from 'react';

export function playerFlap(player, playerConfig) {
    let playerSpeed = player.speed;
    playerSpeed = Math.max(
        playerSpeed - playerConfig.flapSpeed,
        -playerConfig.maxSpeed,
    );
    return playerSpeed;
}

export function playerApplyGravity(player, playerConfig) {
    let playerSpeed = player.speed;
    playerSpeed = Math.min(
        playerSpeed + playerConfig.gravity,
        playerConfig.maxSpeed,
    );
    return playerSpeed;
}   

// determine new player position based on existing position + speed
export function playerPosition(player, board) {
    const playerSpeed = player.speed;
    const boardHeight = board.specs.height;
    let playerYPosition = player.pY;

    // if player moves below bottom of board, move them to top
    if (playerYPosition > (boardHeight / 2)) {
        playerYPosition = boardHeight - (boardHeight + (boardHeight / 2));
    
    // player moves above top, move them to bottom
    } else if (playerYPosition < boardHeight - (boardHeight + (boardHeight / 2))) {
        playerYPosition = boardHeight / 2;
    }

    return playerYPosition + playerSpeed;
}

export const Player = forwardRef(function Player(props, ref) {

    return (
        <svg 
            width="250" height="402" viewBox="0 0 250 402" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-10 m-auto"
            ref={ref}
        >
            <circle cx="125" cy="125" r="125" fill="white"/>
            <path d="M125 242V402M7 263.34L119.583 328.34M129 328.34L241.583 263.34" stroke="white" strokeWidth="20"/>
            <line x1="76.0618" y1="188.68" x2="175.681" y2="197.396" stroke="#0F172A" strokeWidth="20"/>
            <line x1="140" y1="104" x2="190" y2="104" stroke="#0F172A" strokeWidth="30"/>
            <line x1="67" y1="104" x2="117" y2="104" stroke="#0F172A" strokeWidth="30"/>
            <line x1="115" y1="104.5" x2="140" y2="104.5" stroke="#0F172A" strokeWidth="5"/>
        </svg>
    )
});