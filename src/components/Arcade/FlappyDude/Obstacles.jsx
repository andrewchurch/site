import { forwardRef } from 'react';

export function obstaclesSetup(obstaclesConfig, board) {
    let obstacles = [];

    for (let i = 0; i < obstaclesConfig.number; i++) {
        obstacles.push({
            'drawHeight': true,
            'pX': i * ((obstaclesConfig.width + obstaclesConfig.obstaclesGap) * board.rect.width),
            'scored': false,
            'width': obstaclesConfig.width * board.rect.width
        });
    }

    return obstacles;
}

export function obstacleUpdateHeight(obstacle, obstaclesConfig, board) {
    let obstacleTopHeight = 0;
    let obstacleBottomHeight = 0;

    const boardHeight = board.rect.height;

    // top height is between middle of board + threshold and middle of board - threshold
    const maxHeight = (boardHeight / 2) + (boardHeight * obstaclesConfig.obstacleGapThreshold);
    const minHeight = (boardHeight / 2) - (boardHeight * obstaclesConfig.obstacleGapThreshold);
    obstacleTopHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);

    // remove half of gap from obstacleTopHeight so that the gap doesn't only make bottom shorter
    obstacleTopHeight -= obstaclesConfig.obstacleGap / 2 * boardHeight;

    // determine bottom height based on top height + gap
    obstacleBottomHeight = boardHeight - obstacleTopHeight - (boardHeight * obstaclesConfig.obstacleGap);

    return {
        'top': obstacleTopHeight,
        'bottom': obstacleBottomHeight
    };
}

export function obstaclesAccelerate(obstacles, level, levelConfig) {
    return obstacles.speed += levelConfig.speedIncrease;
}

export function obstaclesPosition(obstacles, obstaclesConfig, board) {
    obstacles.obstacles.forEach(function (obstacle, i) {
        let obstacleXPosition = obstacle.pX - (obstacles.speed * board.rect.width);

        // if obstacle is off the gameboard move it back to initial position, update it's height, and reset scoring
        if (Math.abs(obstacleXPosition) > (obstacle.width + board.rect.width)) {
            obstacleXPosition = 0;
            obstacle.drawHeight = true;
            obstacle.height = obstacleUpdateHeight(obstacle, obstaclesConfig, board);
            obstacle.scored = false;
        }

        obstacle.pX = obstacleXPosition;
    });

    return obstacles;
}

export const Obstacle = forwardRef(function Obstacle(props, ref) {

    return (
        <div ref={ref} className="
            absolute left-full h-full w-10 
            before:absolute before:top-0 before:w-full before:bg-white before:h-[var(--obstacle-top-height)] 
            after:absolute after:bottom-0 after:w-full after:bg-white after:h-[var(--obstacle-bottom-height)]
        "></div>
    )
});