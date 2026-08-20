/**
 * Stops all gameplay sounds through the central sound manager.
 */
function stopAllSounds() {
    if (window.soundManager) {
        window.soundManager.resetGameAudio();
    }
    stopStandaloneSounds();
}

/**
 * Stops win/lose and leftover entity sounds that may not be registered yet.
 */
function stopStandaloneSounds() {
    const sounds = [
        typeof winSound !== 'undefined' ? winSound : null,
        typeof loseSound !== 'undefined' ? loseSound : null
    ];
    if (window.world) {
        sounds.push(
            window.world.coinSound,
            window.world.bottleSound,
            window.world.splashBottleSound,
            window.world.dieCharacterSound,
            window.world.character?.walking_sound,
            window.world.character?.jumpSound,
            window.world.character?.hitCharacterSound,
            window.world.character?.dieCharacterSound,
            window.world.character?.sleepSound,
            window.world.endboss?.alertSound,
            window.world.endboss?.attackSound,
            window.world.endboss?.hurtSound,
            window.world.endboss?.dieSound
        );
        window.world.level?.enemies?.forEach((enemy) => {
            sounds.push(enemy.walkingSound, enemy.deadSound);
        });
    }
    sounds.forEach((sound) => {
        if (!sound) return;
        sound.pause();
        try {
            sound.currentTime = 0;
        } catch (error) { }
        sound.loop = false;
    });
}

/**
 * Stops all active intervals and animation frames in the game.
 */
function stopAllIntervals() {
    if (window.world) {
        window.world.stop();
    }
    if (window.gameTimers) {
        window.gameTimers.clearAll();
    }
}

/**
 * Resets the game, stopping all sounds and intervals before reinitializing the world.
 */
function resetGame() {
    hideGameOverScreens();
    stopAllSounds();
    stopAllIntervals();
    window.currentEndboss = null;
    window.isGameStarted = false;
    initLevel();
    const canvas = document.getElementById('canvas');
    window.world = new World(canvas, window.keyboard);
    window.isGameStarted = true;
}

/**
 * Hides game over and win screen overlays.
 */
function hideGameOverScreens() {
    const gameOverOverlay = document.getElementById('gameover_overlay');
    const winOverlay = document.getElementById('winscreen_overlay');
    if (gameOverOverlay) gameOverOverlay.style.display = 'none';
    if (winOverlay) winOverlay.style.display = 'none';
}
