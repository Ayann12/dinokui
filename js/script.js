const game = document.getElementById("game");
const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");


const scoreText = document.getElementById("score");
const bestScoreText = document.getElementById("best-score");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");

const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");


// Variable Game
let gamerunning = false;
let gameOver = false;

let score = 0;

let bestScore = localStorage.getItem("dinoBestScore") || 0;

let dinoY = 0;
let velocityY = 0;

let gravity = 0.7;
let jumpPower = 13;

let cactusX = 900;

let gameSpeed = 6;

let lastTime = 0;
let scoreTimer = 0;


// best score
bestScoreText.textContent = String(bestScore).padStart(5, "0");

// start game

