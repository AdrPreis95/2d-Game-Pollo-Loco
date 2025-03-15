export let isGameStarted = false;

/**
 * Starts the game by setting the game status to "started".
 */
export function startGame() {
    isGameStarted = true;
}

/**
 * Resets the game state to indicate that the game is not started.
 */
export function resetGameState() {
    isGameStarted = false;
}
