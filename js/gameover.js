/**
 * Game-over jingle. Registered as music so the volume slider applies.
 */
const loseSound = new Audio('audio/gameover.mp3');
loseSound.loop = false;
soundManager.registerMusic(loseSound);

function restartGameOver() {
    resetGame();
}

function quitGameOver() {
    document.getElementById('exit-overlay-gameover').style.display = 'flex';
}

function redirectToBlankGameOver() {
    window.open('about:blank', '_blank');
}
