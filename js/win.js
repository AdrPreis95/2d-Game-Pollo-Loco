/**
 * Win jingle. Registered as music so the volume slider applies.
 */
const winSound = new Audio('audio/winsound.mp3');
winSound.loop = false;
soundManager.registerMusic(winSound);

function restartGame() {
    resetGame();
}

function quitGame() {
    document.getElementById('exit-overlay').style.display = 'flex';
}

function redirectToBlank() {
    window.open('about:blank', '_blank');
}
