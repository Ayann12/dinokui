/* ========================================
   ELEMENT
======================================== */

const game = document.getElementById("game");

const dino = document.getElementById("dino");

const cactus = document.getElementById("cactus");

const scoreDisplay = document.getElementById("score");

const bestScoreDisplay = document.getElementById("best-score");

const startScreen = document.getElementById("start-screen");

const gameOverScreen = document.getElementById("game-over-screen");

const startButton = document.getElementById("start-button");

const restartButton = document.getElementById("restart-button");

const finalScore = document.getElementById("final-score");

const finalBestScore = document.getElementById("final-best-score");


/* ========================================
   GAME VARIABLES
======================================== */

let gameRunning = false;

let gameOver = false;

let score = 0;

let bestScore =
    Number(localStorage.getItem("dinoBestScore")) || 0;


/* ========================================
   DINO VARIABLES
======================================== */

let dinoY = 0;

let velocityY = 0;

const gravity = 0.7;

const jumpPower = 13;


/* ========================================
   CACTUS VARIABLES
======================================== */

let cactusX = 900;

let gameSpeed = 6;


/* ========================================
   TIME
======================================== */

let lastTime = 0;

let scoreTimer = 0;


/* ========================================
   UPDATE BEST SCORE
======================================== */

bestScoreDisplay.textContent =
    String(bestScore).padStart(5, "0");


/* ========================================
   UPDATE SCORE DISPLAY
======================================== */

function updateScore() {

    scoreDisplay.textContent =
        String(score).padStart(5, "0");

}


/* ========================================
   GAME THEME
======================================== */

function updateGameTheme() {

    document.body.classList.remove(
        "day",
        "sunset",
        "night",
        "midnight"
    );


    if (score < 500) {

        document.body.classList.add("day");

    }

    else if (score < 1000) {

        document.body.classList.add("sunset");

    }

    else if (score < 1500) {

        document.body.classList.add("night");

    }

    else {

        document.body.classList.add("midnight");

    }

}


/* ========================================
   START GAME
======================================== */

function startGame() {

    gameRunning = true;

    gameOver = false;

    score = 0;

    dinoY = 0;

    velocityY = 0;

    cactusX = game.offsetWidth + 100;

    gameSpeed = 6;

    scoreTimer = 0;

    lastTime = performance.now();


    startScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");


    dino.classList.add("running");

    dino.classList.remove("jumping");


    updateScore();

    updateGameTheme();


    requestAnimationFrame(gameLoop);

}


/* ========================================
   JUMP
======================================== */

function jump() {

    if (!gameRunning) {
        return;
    }


    if (dinoY === 0) {

        velocityY = jumpPower;

        dino.classList.remove("running");

        dino.classList.add("jumping");

    }

}


/* ========================================
   GAME LOOP
======================================== */

function gameLoop(currentTime) {

    if (!gameRunning) {
        return;
    }


    const deltaTime =
        Math.min(
            (currentTime - lastTime) / 16.67,
            2
        );


    lastTime = currentTime;


    /* =========================
       DINO PHYSICS
    ========================= */

    velocityY -= gravity * deltaTime;

    dinoY += velocityY * deltaTime;


    if (dinoY <= 0) {

        dinoY = 0;

        velocityY = 0;

        dino.classList.remove("jumping");

        dino.classList.add("running");

    }


    dino.style.bottom =
        (43 + dinoY) + "px";


    /* =========================
       CACTUS MOVEMENT
    ========================= */

    cactusX -= gameSpeed * deltaTime;


    if (cactusX < -60) {

        cactusX =
            game.offsetWidth +
            Math.random() * 300 +
            100;

    }


    cactus.style.left =
        cactusX + "px";


    /* =========================
       SCORE
    ========================= */

    scoreTimer += deltaTime;


    if (scoreTimer >= 8) {

        score++;

        scoreTimer = 0;

        updateScore();

        updateGameTheme();


        /* =========================
           INCREASE SPEED
        ========================= */

        if (score % 100 === 0) {

            gameSpeed += 0.4;

        }

    }


    /* =========================
       COLLISION
    ========================= */

    if (checkCollision()) {

        endGame();

        return;

    }


    requestAnimationFrame(gameLoop);

}


/* ========================================
   COLLISION
======================================== */

function checkCollision() {

    const dinoRect =
        dino.getBoundingClientRect();

    const cactusRect =
        cactus.getBoundingClientRect();


    /* Sedikit perkecil hitbox */

    const paddingX = 8;

    const paddingY = 5;


    return (

        dinoRect.left + paddingX <
        cactusRect.right - paddingX

        &&

        dinoRect.right - paddingX >
        cactusRect.left + paddingX

        &&

        dinoRect.top + paddingY <
        cactusRect.bottom

        &&

        dinoRect.bottom - paddingY >
        cactusRect.top + paddingY

    );

}


/* ========================================
   GAME OVER
======================================== */

function endGame() {

    gameRunning = false;

    gameOver = true;


    dino.classList.remove("running");

    dino.classList.remove("jumping");


    /* =========================
       BEST SCORE
    ========================= */

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "dinoBestScore",
            bestScore
        );

    }


    bestScoreDisplay.textContent =
        String(bestScore).padStart(5, "0");


    finalScore.textContent =
        score;


    finalBestScore.textContent =
        bestScore;


    gameOverScreen.classList.remove("hidden");

}


/* ========================================
   START BUTTON
======================================== */

startButton.addEventListener(
    "click",
    startGame
);


/* ========================================
   RESTART BUTTON
======================================== */

restartButton.addEventListener(
    "click",
    startGame
);


/* ========================================
   KEYBOARD
======================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();


            if (!gameRunning) {

                if (
                    !gameOver &&
                    !startScreen.classList.contains("hidden")
                ) {

                    startGame();

                }

            }

            else {

                jump();

            }

        }


        /* =========================
           RESTART
        ========================= */

        if (
            event.key.toLowerCase() === "r"
        ) {

            if (gameOver) {

                startGame();

            }

        }

    }
);


/* ========================================
   CLICK GAME = JUMP
======================================== */

game.addEventListener(
    "click",
    function (event) {

        if (
            gameRunning &&
            event.target === game
        ) {

            jump();

        }

    }
);


/* ========================================
   INITIAL THEME
======================================== */

updateGameTheme();