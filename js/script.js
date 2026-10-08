// BIRD RUNNER GAME


// ELEMENT
const game =
    document.getElementById("game");

const dino =
    document.getElementById("dino");

const cactus =
    document.getElementById("cactus");

const scoreText =
    document.getElementById("score");

const bestScoreText =
    document.getElementById("best-score");

const finalScoreText =
    document.getElementById("final-score");

const startScreen =
    document.getElementById("start-screen");

const gameOverScreen =
    document.getElementById(
        "game-over-screen"
    );

const startButton =
    document.getElementById(
        "start-button"
    );

const restartButton =
    document.getElementById(
        "restart-button"
    );


// GAME VARIABLES

let gameRunning = false;

let gameOver = false;

let score = 0;

let bestScore =
    localStorage.getItem(
        "birdBestScore"
    ) || 0;


let birdY = 0;

let velocityY = 0;


// gravitasi
const gravity = 0.7;


// kekuatan lompat
const jumpPower = 13;


// posisi cactus
let cactusX = 900;


// kecepatan game
let gameSpeed = 6;


// timer score
let scoreTimer = 0;


// waktu frame
let lastTime = 0;


// BEST SCORE

bestScoreText.textContent =
    String(bestScore).padStart(
        5,
        "0"
    );


// START GAME

function startGame() {

    gameRunning = true;

    gameOver = false;


    score = 0;

    scoreTimer = 0;


    birdY = 0;

    velocityY = 0;


    gameSpeed = 6;


    cactusX =
        game.offsetWidth + 100;


    scoreText.textContent =
        "00000";


    dino.style.bottom =
        "42px";


    cactus.style.left =
        cactusX + "px";


    startScreen.classList.add(
        "hidden"
    );


    gameOverScreen.classList.add(
        "hidden"
    );


    lastTime =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );

}


// JUMP

function jump() {

    if (!gameRunning) {

        return;

    }


    // hanya bisa lompat
    // ketika menyentuh tanah

    if (birdY <= 0) {

        velocityY =
            jumpPower;

    }

}


// GAME LOOP

function gameLoop(timestamp) {

    if (!gameRunning) {

        return;

    }


    // hitung delta time

    const deltaTime =
        Math.min(
            (timestamp - lastTime)
            / 16.67,
            2
        );


    lastTime =
        timestamp;


    // ====================================
    // BIRD PHYSICS
    // ====================================

    velocityY -=
        gravity *
        deltaTime;


    birdY +=
        velocityY *
        deltaTime;


    // menyentuh tanah

    if (birdY <= 0) {

        birdY = 0;

        velocityY = 0;

    }


    // update posisi burung

    dino.style.bottom =
        (42 + birdY) +
        "px";


    // ====================================
    // CACTUS MOVEMENT
    // ====================================

    cactusX -=
        gameSpeed *
        deltaTime;


    cactus.style.left =
        cactusX + "px";


    // ====================================
    // CACTUS RESET
    // ====================================

    if (cactusX < -80) {

        cactusX =
            game.offsetWidth
            +
            Math.random() * 300
            +
            100;

    }


    // ====================================
    // SCORE
    // ====================================

    scoreTimer +=
        deltaTime;


    if (scoreTimer >= 5) {

        score++;

        scoreTimer = 0;


        scoreText.textContent =
            String(score).padStart(
                5,
                "0"
            );


        // tambah kecepatan
        // setiap 10 score

        if (
            score > 0 &&
            score % 10 === 0
        ) {

            gameSpeed += 0.5;

        }

    }


    // ====================================
    // COLLISION
    // ====================================

    if (checkCollision()) {

        endGame();

        return;

    }


    // lanjut game

    requestAnimationFrame(
        gameLoop
    );

}


// COLLISION

function checkCollision() {

    const birdRect =
        dino.getBoundingClientRect();

    const cactusRect =
        cactus.getBoundingClientRect();


    // hitbox dibuat sedikit lebih kecil
    // supaya tidak terlalu sensitif

    const padding = 8;


    return (

        birdRect.left
        +
        padding
        <
        cactusRect.right
        -
        padding

        &&

        birdRect.right
        -
        padding
        >
        cactusRect.left
        +
        padding

        &&

        birdRect.top
        +
        padding
        <
        cactusRect.bottom
        -
        padding

        &&

        birdRect.bottom
        -
        padding
        >
        cactusRect.top
        +
        padding

    );

}


// GAME OVER

function endGame() {

    gameRunning = false;

    gameOver = true;


    finalScoreText.textContent =
        score;


    // cek best score

    if (
        score >
        Number(bestScore)
    ) {

        bestScore =
            score;


        localStorage.setItem(
            "birdBestScore",
            bestScore
        );


        bestScoreText.textContent =
            String(bestScore)
                .padStart(
                    5,
                    "0"
                );

    }


    gameOverScreen.classList.remove(
        "hidden"
    );

}


// KEYBOARD

document.addEventListener(
    "keydown",
    function (event) {


        // SPACE / ARROW UP

        if (
            event.code === "Space"
            ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();


            // kalau belum mulai
            // langsung mulai

            if (!gameRunning) {

                startGame();

            }

            else {

                jump();

            }

        }


        // =================================
        // DARK MODE
        // =================================

        if (
            event.key.toLowerCase()
            ===
            "d"
        ) {

            document.body.classList.toggle(
                "dark"
            );

        }

    }
);


// START BUTTON

startButton.addEventListener(
    "click",
    function () {

        startGame();

    }
);


// RESTART BUTTON

restartButton.addEventListener(
    "click",
    function () {

        startGame();

    }
);


// CLICK GAME = JUMP

game.addEventListener(
    "click",
    function (event) {


        // jangan trigger ketika
        // klik tombol

        if (
            event.target ===
            startButton
            ||
            event.target ===
            restartButton
        ) {

            return;

        }


        if (gameRunning) {

            jump();

        }

    }
);