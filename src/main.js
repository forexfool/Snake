const TICK_MS = 140;
const STORAGE_KEY = "snake-best-score";
const {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  restartGame,
  stepGame,
  togglePause,
} = window.SnakeGameLogic;

const boardElement = document.querySelector("#board");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const statusElement = document.querySelector("#status");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const controlButtons = document.querySelectorAll("[data-direction]");

let state = createInitialState();
state.bestScore = readBestScore();

renderBoard();
render();

window.addEventListener("keydown", (event) => {
  const direction = getDirectionFromKey(event.key);

  if (direction) {
    event.preventDefault();
    state = queueDirection(state, direction);
    render();
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    state = togglePause(state);
    render();
  }
});

pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  render();
});

restartButton.addEventListener("click", () => {
  state = restartGame(state);
  persistBestScore(state.bestScore);
  render();
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state = queueDirection(state, button.dataset.direction);
    render();
  });
});

window.setInterval(() => {
  const previousScore = state.score;
  state = stepGame(state);

  if (state.score !== previousScore || state.isGameOver) {
    persistBestScore(state.bestScore);
  }

  render();
}, TICK_MS);

function renderBoard() {
  const cells = [];

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    boardElement.appendChild(cell);
    cells.push(cell);
  }

  boardElement._cells = cells;
}

function render() {
  const cells = boardElement._cells ?? [];

  cells.forEach((cell) => {
    cell.className = "cell";
  });

  state.snake.forEach((segment, index) => {
    const cell = cells[toIndex(segment.x, segment.y)];
    if (!cell) {
      return;
    }

    cell.classList.add("cell--snake");
    if (index === 0) {
      cell.classList.add("cell--head");
    }
  });

  if (state.food) {
    const foodCell = cells[toIndex(state.food.x, state.food.y)];
    foodCell?.classList.add("cell--food");
  }

  scoreElement.textContent = String(state.score);
  bestScoreElement.textContent = String(state.bestScore);
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";
  statusElement.textContent = getStatusText(state);
}

function getStatusText(currentState) {
  if (currentState.isGameOver) {
    return "Game over. Press Restart to play again.";
  }

  if (currentState.isPaused) {
    return "Paused.";
  }

  if (!currentState.hasStarted) {
    return "Press any arrow key or WASD to start.";
  }

  return "Eat food, avoid walls, and don't hit yourself.";
}

function getDirectionFromKey(key) {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return "up";
    case "ArrowDown":
    case "s":
    case "S":
      return "down";
    case "ArrowLeft":
    case "a":
    case "A":
      return "left";
    case "ArrowRight":
    case "d":
    case "D":
      return "right";
    default:
      return null;
  }
}

function toIndex(x, y) {
  return y * GRID_SIZE + x;
}

function readBestScore() {
  const value = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) ?? "0", 10);
  return Number.isNaN(value) ? 0 : value;
}

function persistBestScore(score) {
  window.localStorage.setItem(STORAGE_KEY, String(score));
}
