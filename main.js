// script.js
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Paddle settings
const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 5;

// Ball settings
const ballSize = 10;
const ballSpeed = 2;
const winningScore = 5; // Score to win the game

let leftPaddle = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
};
let rightPaddle = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
};
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: ballSize,
  dx: ballSpeed,
  dy: ballSpeed,
};

// Player Names
const player1Name = "Player 1";
const player2Name = "Player 2";

// Control Key Names
const player1Controls = "W (Up) / S (Down)";
const player2Controls = "Arrow Up (Up) / Arrow Down (Down)";

// Scores
let player1Score = 0;
let player2Score = 0;

// Draw Paddle
function drawPaddle(paddle) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#f00"; // Red color for the ball
  ctx.fill();
  ctx.closePath();
}

// Draw Scores
function drawScores() {
  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`${player1Name}: ${player1Score}`, 20, 40);
  ctx.textAlign = "right";
  ctx.fillText(`${player2Name}: ${player2Score}`, canvas.width - 20, 40);
}

// Draw Player Names and Controls
function drawInfo() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`${player1Name}: ${player1Controls}`, 20, 70);
  ctx.textAlign = "right";
  ctx.fillText(`${player2Name}: ${player2Controls}`, canvas.width - 20, 70);
}

// Update Paddle Position
function updatePaddle(paddle) {
  if (
    paddle.y + paddle.dy >= 0 &&
    paddle.y + paddle.dy + paddle.height <= canvas.height
  ) {
    paddle.y += paddle.dy;
  }
}

// Update Ball Position
function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top/bottom
  if (
    ball.y + ball.dy < ball.size ||
    ball.y + ball.dy > canvas.height - ball.size
  ) {
    ball.dy = -ball.dy;
  }

  // Ball collision with paddles
  if (
    (ball.x - ball.size < leftPaddle.x + leftPaddle.width &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + leftPaddle.height) ||
    (ball.x + ball.size > rightPaddle.x &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + rightPaddle.height)
  ) {
    ball.dx = -ball.dx;
  }

  // Ball out of bounds
  if (ball.x + ball.dx < 0) {
    player2Score++;
    resetBall();
  }
  if (ball.x + ball.dx > canvas.width) {
    player1Score++;
    resetBall();
  }

  // Check for game over
  if (player1Score >= winningScore || player2Score >= winningScore) {
    const winner = player1Score >= winningScore ? player1Name : player2Name;
    alert(`${winner} wins!`);
    // Reset scores and restart the game
    player1Score = 0;
    player2Score = 0;
  }
}

// Reset Ball Position
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx;
}

// Control Paddle Movement
document.addEventListener("keydown", (e) => {
  if (e.key === "w") leftPaddle.dy = -paddleSpeed;
  if (e.key === "s") leftPaddle.dy = paddleSpeed;
  if (e.key === "ArrowUp") rightPaddle.dy = -paddleSpeed;
  if (e.key === "ArrowDown") rightPaddle.dy = paddleSpeed;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") leftPaddle.dy = 0;
  if (e.key === "ArrowUp" || e.key === "ArrowDown") rightPaddle.dy = 0;
});

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(leftPaddle);
  drawPaddle(rightPaddle);
  drawBall();
  drawScores();
  drawInfo();
  updatePaddle(leftPaddle);
  updatePaddle(rightPaddle);
  updateBall();
  requestAnimationFrame(gameLoop);
}

gameLoop();