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
let foods;
let bigFood = null;
let started = false;

function startGame() {
  snake = [{ x: 9, y: 9 }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = "0";
  foods = generateRandomFood(20, snake, 2);

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

function renderFoods(foods, bigFood, boxSize, gameBox) {
  gameBox.innerHTML = "";

  foods.forEach(({ x, y }) => {
    const foodDiv = document.createElement("div");
    foodDiv.className = "food";
    Object.assign(foodDiv.style, {
      left: `${x * boxSize}px`,
      top: `${y * boxSize}px`,
      width: `${boxSize}px`,
      height: `${boxSize}px`,
    });
    gameBox.appendChild(foodDiv);
  });

  if (bigFood) {
    const bigDiv = document.createElement("div");
    bigDiv.className = "food";
    Object.assign(bigDiv.style, {
      left: `${bigFood.x * boxSize}px`,
      top: `${bigFood.y * boxSize}px`,
      width: `${boxSize * 1.5}px`,
      height: `${boxSize * 1.5}px`,
    });
    gameBox.appendChild(bigDiv);
  }
}

function generateRandomFood(gridSize, snake, maxCount = 3) {
  const foodCount = Math.floor(Math.random() * maxCount) + 1;
  const foods = [];

  while (foods.length < foodCount) {
    const newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };

    const overlaps =
      foods.some((f) => f.x === newFood.x && f.y === newFood.y) ||
      snake.some((s) => s.x === newFood.x && s.y === newFood.y);

    if (!overlaps) {
      foods.push(newFood);
    }
  }

  return foods;
}

function generateBigFood(gridSize, snake, foods) {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (
    foods.some((f) => f.x === newFood.x && f.y === newFood.y) ||
    snake.some((s) => s.x === newFood.x && s.y === newFood.y)
  );

  return newFood;
}

function draw() {
  renderFoods(foods, bigFood, boxSize, gameBox);

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

  const ateFoodIndex = foods.findIndex(
    (food) => head.x === food.x && head.y === food.y
  );

  const ateBigFood = bigFood && head.x === bigFood.x && head.y === bigFood.y;

  if (ateFoodIndex !== -1) {
    snake.unshift(head);
    score++;
    scoreText.innerText = score;
    foods.splice(ateFoodIndex, 1);
    eatSound.play().catch(() => {});

    if (foods.length === 0) {
      foods = generateRandomFood(20, snake, 2);

      if (Math.random() < 0.3) {
        bigFood = generateBigFood(20, snake, foods);
      }
    }
  } else if (ateBigFood) {
    snake.unshift(head);
    const extraSegment = { ...head };
    snake.unshift(extraSegment);
    score += 2;
    scoreText.innerText = score;
    bigFood = null;
    eatSound.play().catch(() => {});
  } else {
    snake.pop();
    snake.unshift(head);
  }

  draw();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});
