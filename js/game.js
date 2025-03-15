import { startGame, isGameStarted } from './gamestate.js';
window.character = null;
let canvas, world;
window.keyboard = new CustomKeyboard();

/**
 * Initializes the game if it has been started.
 */
function init() {
    if (!isGameStarted) {
        console.warn('The game has not been started yet!');
        return;
    }
    canvas = document.getElementById('canvas');
    window.world = new World(canvas, keyboard);

    setupTouchControls();

}

/**
 * Starts the game when the play button is clicked.
 */
document.getElementById('play-icon').addEventListener('click', () => {
    startGame();
    init();

});

/**
 * Event listener for key press events.
 */
window.addEventListener("keydown", (event) => {
    if (event.keyCode === 39) keyboard.RIGHT = true;
    if (event.keyCode === 37) keyboard.LEFT = true;
    if (event.keyCode === 32) keyboard.SPACE = true;
    if (event.keyCode === 70) keyboard.F = true;
});

/**
 * Event listener for key release events.
 */
window.addEventListener("keyup", (event) => {
    if (event.keyCode === 39) keyboard.RIGHT = false;
    if (event.keyCode === 37) keyboard.LEFT = false;
    if (event.keyCode === 32) keyboard.SPACE = false;
    if (event.keyCode === 70) keyboard.F = false;
});

/**
 * Setup touch controls for mobile devices.
 */
function setupTouchControls() {
    const btnLeft = document.getElementById("btn-left");
    const btnRight = document.getElementById("btn-right");
    const btnJump = document.getElementById("btn-jump");
    const btnThrow = document.getElementById("btn-throw");

    if (!btnLeft || !btnRight || !btnJump || !btnThrow) {
        console.error("  Touch-Button wurde nicht gefunden");
        return;
    }

    btnLeft.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    }, { passive: false });

    btnLeft.addEventListener("touchend", () => {
        keyboard.LEFT = false;

    });

    btnRight.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    }, { passive: false });

    btnRight.addEventListener("touchend", () => {
        keyboard.RIGHT = false;
    });

    btnJump.addEventListener("touchstart", (e) => {
        e.preventDefault();
        console.log("✅ Touch erkannt!");
    
        if (!window.world || !window.world.character) {
            console.error(" Kein Charakter gefunden! Setze neuen Charakter...");
            window.world.character = new Character(); // Neuer Charakter
        }
    
        console.log("Touch-Sprung = SPACE-Sprung!");
        keyboard.SPACE = true;
        setTimeout(() => keyboard.SPACE = false, 150);
    });
    

    btnThrow.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.F = true;
        setTimeout(() => keyboard.F = false, 150);
    });
}

/**
 * Debugging: Prüfen, ob `keyboard`-Eingaben funktionieren.
 */
setInterval(() => {

}, 2000);
