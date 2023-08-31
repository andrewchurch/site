import './game.css';
import { useEffect, useRef } from 'react';
import { Player, playerFlap, playerApplyGravity, playerPosition } from './Player';
import { Obstacle, obstaclesSetup, obstacleUpdateHeight, obstaclesAccelerate, obstaclesPosition } from './Obstacles';

const gameConfig = {
    'maxFps': 60, // throttles fps to keep consistent speed on higher refresh screens
    'debugFps': false, // if true, displays throttled fps and fps on screen
    'collisions': true, // set to false to disable collisions (when debugging)
    'obstacles': {
        'initialSpeed': 0.004, // movement in board width per frame
        'speedIncrease': 0.000001, // increase in speed per frame

        // NOTE: obstacleGap + (obstacleGapTreshold * 2) shouldn't be more than 1
        'obstacleGap': 0.25, // gap within obstacle in percentage of board height
        'obstacleGapThreshold': 0.30, // +/- from middle that gap can appear, in percentage of board height

        // NOTE: (number * obstaclesGap) + ((number - 1) * width) needs to equal 1
        'number': 2, // number of obstacles, 
        'width': 0.05, // width of obstacle in percentage of board width (0.10 = 10%)
        'obstaclesGap': 0.45, // gap between obstacles in percentage of board width
    },
    'player': {
        'height': .05, // height of player in percentage of board height 
        'initialSpeed': 0, // movement in percentage of board height per frame
        'maxSpeed': 0.0125, // movement in percentage of board height per frame 
        'gravity': 0.00025, // decrease in speed per frame
        'flapSpeed': 0.0110 // increase in speed when flapping
    },
};

export default function Game({endGame}) {
    
    const gameState = useRef({
        'score': 0,
        'obstacles': {
            'speed': gameConfig.obstacles.initialSpeed,
            'obstacles': [],
        },
        'player': {
            'speed': gameConfig.player.initialSpeed,
            'pY': 0
        }
    });

    // tick related
    const frame = useRef(0);
    const fpsCount = useRef(0);
    const fpsCountThrottled = useRef(0);
    const msPrev = useRef(window.performance.now());

    // dom references
    const gameBoardRef = useRef(null);
    const playerRef = useRef(null);
    const obstaclesRef = useRef([]);
    const scoreRef = useRef(null);
    const frameCounterRef = useRef(null);

    // set up board -- this happens once on initial render AND every time the window is resized
    function boardSetup() {

        // get and store board size
        gameState.current.board = {
            'rect': gameBoardRef.current.getBoundingClientRect()
        };

        // set player size based on game board height (so that it makes sense on small screens)
        const playerHeight = gameConfig.player.height * gameState.current.board.rect.height;
        
        // get width ratio from initial state so we don't need to also specify width in config
        const playerRect = playerRef.current.getBoundingClientRect();
        const widthRatio = playerRect.width / playerRect.height;
        
        playerRef.current.style.height = playerHeight + 'px';
        playerRef.current.style.width = playerHeight * widthRatio + 'px';

        // update game state with obstacle info
        gameState.current.obstacles.obstacles = obstaclesSetup(gameConfig.obstacles, gameState.current.board);

        // set obstacle width (which remains constant during play)
        // and initial obstacle gap (which will be updated each time the obstacle moves off the board)
        obstaclesRef.current.forEach(function (obstacleRef, i) {
            obstacleRef.style.width = gameState.current.obstacles.obstacles[i].width + 'px';
            gameState.current.obstacles.obstacles[i].height = obstacleUpdateHeight(gameState.current.obstacles.obstacles[i], gameConfig.obstacles, gameState.current.board);
        });
    }

    function detectCollision() {

        const playerRect = playerRef.current.getBoundingClientRect();

        // check each obstacle for overlap
        for (let i = 0; i < obstaclesRef.current.length; i++) {
            const obstacle = obstaclesRef.current[i];
            const obstacleRect = obstacle.getBoundingClientRect();

            // check if player is in x bounds of any obstacle first (this is the easier calculation)
            // if left edge of player is < right edge of obstacle
            // AND right edge of player is > left edge of obstacle
            // then have horizontal overlap
            if (
                playerRect.x < obstacleRect.x + obstacleRect.width
                && playerRect.x + playerRect.width > obstacleRect.x
            ) {

                // player in x bounds of this obstacle so we check y bounds
                // can't use simple rect here since we both a top and bottom part of obstacle
                // if top of player is < height of top 
                // OR if bottom of player is > height of top + gap
                const obstacleTopHeight = gameState.current.obstacles.obstacles[i].height.top;
                const gapHeight = gameConfig.obstacles.obstacleGap * gameState.current.board.rect.height;
                if (
                    playerRect.y < obstacleTopHeight
                    || playerRect.y + playerRect.height > obstacleTopHeight + gapHeight
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    function detectUpdateScore(obstacles) {
        obstacles.obstacles.forEach(function (obstacle, i) {
            
            // if we haven't already scored with this obstacle
            if (!obstacle.scored) {

                // then check to see if it's past the midway point of board
                if ((Math.abs(obstacle.pX) - obstacle.width) > gameState.current.board.rect.width / 2) {
                    obstacle.scored = true;
                    scoreRef.current.innerHTML = ++gameState.current.score;
                }
            }
        });
    }

    function tick(newtime) {

        fpsCount.current++;

        // do this again ASAP
        frame.current = requestAnimationFrame(tick);

        const msPerFrame = 1000 / gameConfig.maxFps;
        const msElapsed = newtime - msPrev.current;

        // throttle fps
        // https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
        // https://chriscourses.com/blog/standardize-your-javascript-games-framerate-for-different-monitors
        if (msElapsed > msPerFrame) {
            msPrev.current = newtime - (msElapsed % msPerFrame);
        } else {
            return;
        }

        fpsCountThrottled.current++;

        // accelerate and position player
        gameState.current.player.speed = playerApplyGravity(gameState.current.player, gameConfig.player);
        gameState.current.player.pY = playerPosition(gameState.current.player, gameState.current.board);

        // accelerate and position obstacles
        gameState.current.obstacles.speed = obstaclesAccelerate(gameState.current.obstacles, gameConfig.obstacles);
        gameState.current.obstacles = obstaclesPosition(gameState.current.obstacles, gameConfig.obstacles, gameState.current.board);

        if (gameConfig.collisions && detectCollision()) {
            endGame(gameState.current.score);
        }

        detectUpdateScore(gameState.current.obstacles);

        draw();
    }

    function draw() {

        // draw player
        playerRef.current.style.transform = `translateY(${gameState.current.player.pY}px)`;

        // draw obstacles
        obstaclesRef.current.forEach(function (obstacleRef, i) {
            obstacleRef.style.transform = `translateX(${gameState.current.obstacles.obstacles[i].pX}px)`;

            // only draw updated height when we need to
            if (gameState.current.obstacles.obstacles[i].drawHeight) {
                gameState.current.obstacles.obstacles[i].drawHeight = false;
                obstacleRef.style.setProperty('--obstacle-top-height', `${gameState.current.obstacles.obstacles[i].height.top}px`);
                obstacleRef.style.setProperty('--obstacle-bottom-height', `${gameState.current.obstacles.obstacles[i].height.bottom}px`);
            }
        });
    }

    function logFrames() {
        frameCounterRef.current.innerHTML = fpsCountThrottled.current + ' / ' + fpsCount.current;
        fpsCount.current = 0;
        fpsCountThrottled.current = 0;
    }

    function handleBoardClick() {
        gameState.current.player.speed = playerFlap(gameState.current.player, playerRef.current, gameConfig.player);
    }

    useEffect(() => {       
        window.addEventListener('resize', boardSetup); 
        boardSetup();

        // tick with throttled RAF
        frame.current = requestAnimationFrame(tick);

        let frameLogInterval = null;
        if (gameConfig.debugFps) {
            frameLogInterval = setInterval(logFrames, 1000);
        }

        return () => {
            window.removeEventListener('resize', boardSetup);
            cancelAnimationFrame(frame.current);
            clearInterval(frameLogInterval);
        }
    }, []);

    let obstacleComponents = [];
    for (let i = 0; i < gameConfig.obstacles.number; i++) {
        obstacleComponents[i] = <Obstacle key={i} ref={(element) => obstaclesRef.current[i] = element} />;
    }

    return (
        <div ref={gameBoardRef} onClick={handleBoardClick} className="w-full h-full relative flex cursor-pointer">
            <div className="absolute top-2 left-4 px-4 py-2 bg-slate-500 text-lg font-arcade z-10">
                Score: <span ref={scoreRef}>0</span>
            </div>
            <Player ref={playerRef} />
            {obstacleComponents}
            {gameConfig.debugFps && 
                <div ref={frameCounterRef} className="absolute bottom-0 right-0 bg-black text-xs"></div>
            }
        </div>
    )
}