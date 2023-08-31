import { forwardRef } from 'react';

export function playerFlap(player, playerRef, playerConfig) {
    let playerSpeed = player.speed;

    // increase player speed by flap speed up to max
    playerSpeed = Math.max(
        playerSpeed - playerConfig.flapSpeed,
        -playerConfig.maxSpeed,
    );

    // animate player
    playerRef.classList.add('flap');
    setTimeout(() => playerRef && playerRef.classList.remove('flap'), 100);

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
    const boardHeight = board.rect.height;

    let playerYPosition = player.pY + (playerSpeed * boardHeight);

    // if player moves below bottom of board, move them to top
    if (playerYPosition > (boardHeight / 2)) {
        playerYPosition = boardHeight - (boardHeight + (boardHeight / 2));
        player.looped = true;
    
    // player moves above top, move them to bottom
    } else if (playerYPosition < boardHeight - (boardHeight + (boardHeight / 2))) {
        playerYPosition = boardHeight / 2;
        player.looped = true;
    }

    player.pY = playerYPosition;

    return player;
}

export const Player = forwardRef(function Player(props, ref) {

    return (
        <svg 
            width="250" height="400" viewBox="0 0 250 400" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="player w-[25px] h-[40px] m-auto"
            ref={ref}
        >
            <circle cx="125" cy="125" r="125" fill="white"/>
            <path className="player-body player-body--at-rest" d="M125 240V400M7 261.34L119.583 326.34M129 326.34L241.583 261.34" stroke="white" strokeWidth="20"/>
            <path className="player-body player-body--flapping" d="M125 240V400M7 391.34L119.583 326.34M130 326.34L242.583 391.34" stroke="white" strokeWidth="20"/ >
            <line x1="76.0618" y1="188.68" x2="175.681" y2="197.396" stroke="#0F172A" strokeWidth="20"/>
            <line x1="140" y1="104" x2="190" y2="104" stroke="#0F172A" strokeWidth="30"/>
            <line x1="67" y1="104" x2="117" y2="104" stroke="#0F172A" strokeWidth="30"/>
            <line x1="115" y1="104.5" x2="140" y2="104.5" stroke="#0F172A" strokeWidth="5"/>
        </svg>
    )
});