import { startGame, isGameStarted } from './gamestate.js';

window.keyboard = new CustomKeyboard();

/**
 * Creates the game world and binds touch controls.
 */
function init() {
    if (!isGameStarted && !window.isGameStarted) return;
    const canvas = document.getElementById('canvas');
    window.world = new window.World(canvas, window.keyboard);
    setupTouchControls();
}

window.initGame = function () {
    startGame();
    window.isGameStarted = true;
    init();
};

window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') window.keyboard.RIGHT = true;
    if (event.key === 'ArrowLeft') window.keyboard.LEFT = true;
    if (event.key === ' ') {
        event.preventDefault();
        window.keyboard.SPACE = true;
    }
    if (event.key === 'f' || event.key === 'F') window.keyboard.F = true;
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') window.keyboard.RIGHT = false;
    if (event.key === 'ArrowLeft') window.keyboard.LEFT = false;
    if (event.key === ' ') window.keyboard.SPACE = false;
    if (event.key === 'f' || event.key === 'F') window.keyboard.F = false;
});

/**
 * Maps on-screen buttons to the same keyboard flags used on desktop.
 */
function setupTouchControls() {
    const buttons = [
        { id: 'btn-left', key: 'LEFT' },
        { id: 'btn-right', key: 'RIGHT' },
        { id: 'btn-jump', key: 'SPACE' },
        { id: 'btn-throw', key: 'F' }
    ];
    const first = document.getElementById('btn-left');
    if (!first || first.dataset.bound === 'true') return;
    first.dataset.bound = 'true';

    buttons.forEach(({ id, key }) => {
        const button = document.getElementById(id);
        if (!button) return;
        button.addEventListener('touchstart', (event) => {
            event.preventDefault();
            window.keyboard[key] = true;
        }, { passive: false });
        button.addEventListener('touchend', () => {
            window.keyboard[key] = false;
        });
    });
}
