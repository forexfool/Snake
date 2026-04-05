# Snake

Small zero-dependency browser implementation of classic Snake.

## Run

Open [index.html](C:\Users\oscar\Desktop\Test\index.html) in a browser.

You can also serve the folder with any static file server and navigate to `/index.html`, but it is no longer required.

## Files

- `index.html`: minimal game shell and controls
- `styles.css`: simple repo-friendly styling
- `src/gameLogic.js`: deterministic snake state and tick logic
- `src/main.js`: rendering, input handling, pause/restart, best-score persistence

## Manual verification

- Start movement with arrow keys or `WASD`
- Confirm the snake moves one cell per tick and cannot reverse directly into itself
- Eat food and confirm the score increases and the snake grows by one segment
- Hit a wall or the snake body and confirm game-over appears
- Press `Pause` or spacebar and confirm movement stops until resumed
- Press `Restart` and confirm the board resets cleanly
- On a narrow/mobile viewport, confirm the on-screen direction buttons work

## Notes

Automated tests were not added because this repo does not currently include a test runner or a Node environment to execute one.
