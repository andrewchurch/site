import './game.css';
import { useEffect, useRef } from 'react';
import { Player, playerFlap, playerApplyGravity, playerPosition } from './Player';
import { Obstacle, obstaclesSetup, obstacleUpdateHeight, obstaclesAccelerate, obstaclesPosition } from './Obstacles';

const gameConfig = {
    'maxFps': 60, // throttles fps to keep consistent speed on higher refresh screens
    'debugFps': false, // if true, displays throttled fps and fps on screen
    'collisions': true, // set to false to disable collisions (when debugging)
    'levels': {
        'scoreThreshold': 7, // base number of scores per level needed to move to next
        'scoreThresholdIncreasePerLevel': 1, // how many more scores per level needed
        'speedIncrease': 0.0005, // obstacle speed increase per level
        'colors': [ // color to change to per level
            'bg-slate-500',
            'bg-sky-900',
            'bg-teal-900',
            'bg-yellow-900',
            'bg-red-900'
        ],
    },
    'obstacles': {
        'initialSpeed': 0.0040, // movement in board width per frame

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
        'flapSpeed': 0.0110, // increase in speed when flapping
        'loopScoreBonus': 3 // bonus scoring when player loops
    },
};

export default function Game({endGame}) {
    
    const gameState = useRef({
        'level': 1,
        'score': 0,
        'obstacles': {
            'speed': gameConfig.obstacles.initialSpeed,
            'obstacles': [],
        },
        'player': {
            'speed': gameConfig.player.initialSpeed,
            'pY': 0,
            'looped': false
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
    const levelRef = useRef(null);
    const messageRef = useRef(null);
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

    let timeoutId;
    function showMessage(message) {
        clearTimeout(timeoutId);
        messageRef.current.textContent = message;
        messageRef.current.classList.remove('hidden');
        timeoutId = setTimeout(() => {
            if (messageRef.current) {
                messageRef.current.classList.add('hidden');
                messageRef.current.textContent = '';
            }
        }, 2000);
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

    function detectUpdateLevel() {
        
        // threshold is current level * (threshold + level increase for this level)
        const currentLevelScoreThreshold = 
            gameState.current.level * 
            (
                gameConfig.levels.scoreThreshold + 
                (gameState.current.level * gameConfig.levels.scoreThresholdIncreasePerLevel)
            );

        // level up!
        if (gameState.current.score > currentLevelScoreThreshold) {

            // change bg color
            const oldLevelColor = gameConfig.levels.colors[gameState.current.level - 1];
            const newLevelColor = gameConfig.levels.colors[gameState.current.level];
            if (newLevelColor) {
                gameBoardRef.current.classList.add(newLevelColor);
                gameBoardRef.current.classList.remove(oldLevelColor);
            }

            showMessage('Level Up!');

            // update speed
            gameState.current.obstacles.speed = obstaclesAccelerate(gameState.current.obstacles, gameState.current.level, gameConfig.levels);

            // update level counter
            levelRef.current.textContent = ++gameState.current.level;
        }
    }

    function detectUpdateScore() {
        gameState.current.obstacles.obstacles.forEach(function (obstacle, i) {
            
            // if we haven't already scored with this obstacle
            if (!obstacle.scored) {

                // then check to see if it's past the midway point of board
                // if it has, then the player scored
                if ((Math.abs(obstacle.pX) - obstacle.width) > gameState.current.board.rect.width / 2) {
                    obstacle.scored = true;

                    // check if player looped if so it's bonus points
                    let newScore = gameState.current.score + 1;
                    if (gameState.current.player.looped) {
                        newScore = gameState.current.score + gameConfig.player.loopScoreBonus;
                        showMessage(`Looped! +${gameConfig.player.loopScoreBonus} Points.`);
                        gameState.current.player.looped = false;
                    }
                    gameState.current.score = newScore;
                    scoreRef.current.textContent = gameState.current.score;

                    detectUpdateLevel();
                }
            }
        });
    }

    function tick(newtime) {

        fpsCount.current++;

        // do this again ASAP
        frame.current = requestAnimationFrame(tick);

        // throttle fps
        // https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
        // https://chriscourses.com/blog/standardize-your-javascript-games-framerate-for-different-monitors
        const msPerFrame = 1000 / gameConfig.maxFps;
        const msElapsed = newtime - msPrev.current;
        if (msElapsed > msPerFrame) {
            msPrev.current = newtime - (msElapsed % msPerFrame);
        } else {
            return;
        }

        fpsCountThrottled.current++;

        // accelerate and position player
        gameState.current.player.speed = playerApplyGravity(gameState.current.player, gameConfig.player);
        gameState.current.player = playerPosition(gameState.current.player, gameState.current.board);

        // accelerate and position obstacles
        gameState.current.obstacles = obstaclesPosition(gameState.current.obstacles, gameConfig.obstacles, gameState.current.board);

        if (gameConfig.collisions && detectCollision()) {
            endGame(gameState.current.score);
        }

        detectUpdateScore();

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
        frameCounterRef.current.textContent = fpsCountThrottled.current + ' / ' + fpsCount.current;
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
        <div ref={gameBoardRef} onClick={handleBoardClick} className="w-full h-full relative flex cursor-pointer transition-colors">
            <div className="absolute top-2 left-2 px-4 py-2 bg-slate-500 font-arcade flex gap-2 z-10">
                <p>Level: <span ref={levelRef}>1</span></p>
                <p>Score: <span ref={scoreRef}>0</span></p>
            </div>
            <Player ref={playerRef} />
            {obstacleComponents}
            <div ref={messageRef} className="hidden absolute bottom-2 left-2 px-4 py-2 bg-slate-500 font-arcade flex gap-2 z-10"></div>
            {gameConfig.debugFps && 
                <div ref={frameCounterRef} className="absolute bottom-0 right-0 bg-black text-xs"></div>
            }
        </div>
    )
}