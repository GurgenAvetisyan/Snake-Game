const gameBox = document.getElementById("game");
const scoreText = document.getElementById("score");

const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const gameOverMessage = document.getElementById("gameOver");

startBtn.addEventListener("click", () => {
  started = true;
  startBtn.style.display = "none";
  startGame();
});

restartBtn.addEventListener("click", () => {
  if (started) startGame();
});

const boxSize = 20;
let direction;
let score;
let game;
let snake;
let food;
let started = false;

function startGame() {
  snake = [{ x: 9, y: 9 }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = "0";
  food = {
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 20),
  };

  if (game) clearInterval(game);
  game = setInterval(moveSnake, 200);
  draw();
}

function gameOver() {
  gameOverSound.play().catch(() => {});
  clearInterval(game);
  const gameOverDiv = document.createElement("div");
  gameOverDiv.classList.add("gameOver");
  gameOverDiv.innerHTML = "Game Over";
  gameBox.appendChild(gameOverDiv);
}

function draw() {
  gameBox.innerHTML = "";

  const foodDiv = document.createElement("div");
  foodDiv.classList.add("food");
  foodDiv.style.left = food.x * boxSize + "px";
  foodDiv.style.top = food.y * boxSize + "px";
  foodDiv.style.borderRadius = "50%";
  gameBox.appendChild(foodDiv);

  snake.forEach((segment, index) => {
    const segDiv = document.createElement("div");
    segDiv.classList.add("segment");
    if (index === 0) {
      segDiv.classList.add("head");

      let angle = 0;
      if (direction === "UP") angle = 180;
      else if (direction === "RIGHT") angle = -90;
      else if (direction === "LEFT") angle = 90;
      else angle = 0;

      segDiv.style.transform = `rotate(${angle}deg)`;
    }

    segDiv.style.left = segment.x * boxSize + "px";
    segDiv.style.top = segment.y * boxSize + "px";
    gameBox.appendChild(segDiv);
  });
}

function moveSnake() {
  let head = { ...snake[0] };

  if (direction === "UP") head.y -= 1;
  if (direction === "DOWN") head.y += 1;
  if (direction === "LEFT") head.x -= 1;
  if (direction === "RIGHT") head.x += 1;

  if (
    head.x < 0 ||
    head.x >= 20 ||
    head.y < 0 ||
    head.y >= 20 ||
    snake.some((part) => part.x === head.x && part.y === head.y)
  ) {
    gameOver();
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    score++;
    scoreText.innerText = score;
    food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
    eatSound.play().catch(() => {});
  } else {
    snake.pop();
    snake.unshift(head);
  }
  console.log(snake, "snake");

  draw();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});
