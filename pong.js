const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - 20 - PADDLE_WIDTH;

// Player
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;

// AI
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
const AI_SPEED = 3;

// Ball
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelX = Math.random() > 0.5 ? 4 : -4;
let ballVelY = (Math.random() - 0.5) * 6;

// Score
let playerScore = 0;
let aiScore = 0;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;

  // Clamp paddle within canvas
  if (playerY < 0) playerY = 0;
  if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, size = 32) {
  ctx.fillStyle = "#fff";
  ctx.font = `${size}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballVelX = Math.random() > 0.5 ? 4 : -4;
  ballVelY = (Math.random() - 0.5) * 6;
}

function updateAI() {
  // Move AI paddle toward ball
  let center = aiY + PADDLE_HEIGHT / 2;
  if (center < ballY - 10) {
    aiY += AI_SPEED;
  } else if (center > ballY + 10) {
    aiY -= AI_SPEED;
  }
  // Clamp
  if (aiY < 0) aiY = 0;
  if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

function updateBall() {
  ballX += ballVelX;
  ballY += ballVelY;

  // Top and bottom wall collision
  if (ballY - BALL_RADIUS < 0) {
    ballY = BALL_RADIUS;
    ballVelY = -ballVelY;
  }
  if (ballY + BALL_RADIUS > canvas.height) {
    ballY = canvas.height - BALL_RADIUS;
    ballVelY = -ballVelY;
  }

  // Left paddle collision (player)
  if (
    ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
    ballY > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
    ballVelX = -ballVelX;
    // Add some "english"
    let collidePoint = ballY - (playerY + PADDLE_HEIGHT / 2);
    ballVelY = collidePoint * 0.2;
  }

  // Right paddle collision (AI)
  if (
    ballX + BALL_RADIUS > AI_X &&
    ballY > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_RADIUS;
    ballVelX = -ballVelX;
    // Add some "english"
    let collidePoint = ballY - (aiY + PADDLE_HEIGHT / 2);
    ballVelY = collidePoint * 0.2;
  }

  // Left or right wall (score)
  if (ballX - BALL_RADIUS < 0) {
    aiScore++;
    resetBall();
  }
  if (ballX + BALL_RADIUS > canvas.width) {
    playerScore++;
    resetBall();
  }
}

function draw() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, "#222");

  // Draw net
  for (let y = 0; y < canvas.height; y += 30) {
    drawRect(canvas.width / 2 - 2, y, 4, 20, "#555");
  }

  // Draw paddles
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");

  // Draw ball
  drawCircle(ballX, ballY, BALL_RADIUS, "#fff");

  // Draw scores
  drawText(playerScore, canvas.width / 2 - 60, 50, 40);
  drawText(aiScore, canvas.width / 2 + 60, 50, 40);
}

function gameLoop() {
  updateAI();
  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();