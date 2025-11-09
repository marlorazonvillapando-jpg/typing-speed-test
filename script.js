// Words array with adaptive difficulty
let words = [
  "hello", "world", "javascript", "typing", "speed", "test", 
  "interactive", "development", "multitasking", "efficiency", 
  "programming", "challenge", "keyboard", "practice", 
  "functionality", "algorithm", "optimization", "frontend", "backend", 
  "performance", "responsiveness", "animation", "interface", "experience",
  "asynchronous", "polymorphism", "inheritance", "encapsulation", "abstraction"
];

// DOM Elements
const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreBoard = document.getElementById("score-board");
const highScoreBoard = document.getElementById("high-score-board");
const timeBoard = document.getElementById("time-board");
const startBtn = document.getElementById("start-btn");
const musicBtn = document.getElementById("music-btn");

// Audio
const bgMusic = document.getElementById("bg-music");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

let score = 0;
let time = 60;
let currentWord = "";
let timer;
let timeDecrease = 0;

// Load high score
let highScore = localStorage.getItem("highScore") || 0;
highScoreBoard.innerText = `High Score: ${highScore}`;

// Start Game
function startGame() {
    score = 0;
    time = 60;
    timeDecrease = 0;
    scoreBoard.innerText = `Score: ${score}`;
    timeBoard.innerText = `Time: ${time}s`;
    wordInput.disabled = false;
    wordInput.value = "";
    wordInput.focus();

    bgMusic.play().catch(() => { console.log("Click Start to play music."); });

    nextWord();
    clearInterval(timer);
    timer = setInterval(updateTime, 1000);
}

// Show next word
function nextWord() {
    let adaptiveWords = words.filter(w => w.length >= 3 + Math.floor(score/5));
    const randomIndex = Math.floor(Math.random() * adaptiveWords.length);
    currentWord = adaptiveWords[randomIndex];
    wordDisplay.innerText = currentWord;
    wordDisplay.classList.remove("correct", "wrong");
    wordInput.value = "";
}

// Timer countdown
function updateTime() {
    let adjustedTime = time - timeDecrease;
    adjustedTime = adjustedTime < 1 ? 1 : adjustedTime;
    adjustedTime--;
    timeBoard.innerText = `Time: ${adjustedTime}s`;
    time = adjustedTime;
    if (time <= 0) endGame();
}

// End Game
function endGame() {
    clearInterval(timer);
    wordInput.disabled = true;
    wordDisplay.innerText = `Game Over! Your score: ${score}`;
    bgMusic.pause();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreBoard.innerText = `High Score: ${highScore}`;
        alert("🎉 New High Score! 🎉");
    }
}

// Input event
wordInput.addEventListener("input", () => {
    if (wordInput.value.trim() === currentWord) {
        score++;
        scoreBoard.innerText = `Score: ${score}`;
        wordDisplay.classList.add("correct");
        correctSound.play();
        createConfetti(score);
        if (score % 5 === 0) timeDecrease += 1;
        nextWord();
    } else if (!currentWord.startsWith(wordInput.value.trim())) {
        wordDisplay.classList.add("wrong");
        wrongSound.play();
    } else {
        wordDisplay.classList.remove("wrong", "correct");
    }
});

// Toggle music
musicBtn.addEventListener("click", () => {
    if (bgMusic.paused) bgMusic.play();
    else bgMusic.pause();
});

startBtn.addEventListener("click", startGame);

// Confetti function
function createConfetti(score) {
    const confettiCount = Math.min(30, 10 + Math.floor(score / 2));
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.width = Math.random() * 15 + 10 + "px";
        confetti.style.height = confetti.style.width;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1500);
    }
}
