(function attachSnakeGameLogic(global) {
  const GRID_SIZE = 16;
  const INITIAL_DIRECTION = "right";

  const DIRECTION_VECTORS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  const OPPOSITES = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };

  function createInitialState(random = Math.random) {
    const snake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
    ];

    return {
      gridSize: GRID_SIZE,
      snake,
      direction: INITIAL_DIRECTION,
      pendingDirection: INITIAL_DIRECTION,
      food: getRandomFoodPosition(GRID_SIZE, snake, random),
      score: 0,
      bestScore: 0,
      isGameOver: false,
      isPaused: false,
      hasStarted: false,
    };
  }

  function queueDirection(state, nextDirection) {
    if (!DIRECTION_VECTORS[nextDirection]) {
      return state;
    }

    const referenceDirection = state.hasStarted ? state.direction : state.pendingDirection;
    if (OPPOSITES[referenceDirection] === nextDirection) {
      return state;
    }

    return {
      ...state,
      pendingDirection: nextDirection,
      hasStarted: true,
    };
  }

  function togglePause(state) {
    if (state.isGameOver) {
      return state;
    }

    return {
      ...state,
      isPaused: !state.isPaused,
    };
  }

  function restartGame(state, random = Math.random) {
    const nextState = createInitialState(random);
    return {
      ...nextState,
      bestScore: Math.max(state.bestScore, state.score),
    };
  }

  function stepGame(state, random = Math.random) {
    if (state.isGameOver || state.isPaused || !state.hasStarted) {
      return state;
    }

    const direction = state.pendingDirection;
    const movement = DIRECTION_VECTORS[direction];
    const head = state.snake[0];
    const nextHead = {
      x: head.x + movement.x,
      y: head.y + movement.y,
    };

    const grows = positionsEqual(nextHead, state.food);
    const nextSnake = [nextHead, ...state.snake];

    if (!grows) {
      nextSnake.pop();
    }

    if (hitsWall(nextHead, state.gridSize) || hitsSelf(nextHead, nextSnake.slice(1))) {
      return {
        ...state,
        direction,
        isGameOver: true,
        isPaused: false,
        bestScore: Math.max(state.bestScore, state.score),
      };
    }

    const score = grows ? state.score + 1 : state.score;
    const food = grows
      ? getRandomFoodPosition(state.gridSize, nextSnake, random)
      : state.food;

    return {
      ...state,
      snake: nextSnake,
      direction,
      pendingDirection: direction,
      food,
      score,
      bestScore: Math.max(state.bestScore, score),
    };
  }

  function getRandomFoodPosition(gridSize, snake, random = Math.random) {
    const openCells = [];

    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        if (!snake.some((segment) => segment.x === x && segment.y === y)) {
          openCells.push({ x, y });
        }
      }
    }

    if (openCells.length === 0) {
      return null;
    }

    const index = Math.floor(random() * openCells.length);
    return openCells[index];
  }

  function positionsEqual(a, b) {
    return Boolean(a && b) && a.x === b.x && a.y === b.y;
  }

  function hitsWall(position, gridSize) {
    return position.x < 0 || position.y < 0 || position.x >= gridSize || position.y >= gridSize;
  }

  function hitsSelf(head, body) {
    return body.some((segment) => positionsEqual(segment, head));
  }

  global.SnakeGameLogic = {
    GRID_SIZE,
    createInitialState,
    queueDirection,
    restartGame,
    stepGame,
    togglePause,
  };
})(window);
