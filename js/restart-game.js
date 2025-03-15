/**
 * Stops all sounds in the game, including character, enemies, collectibles, and game event sounds.
 */
function stopAllSounds() {
    if (!world) return;
    stopCharacterSounds();
    stopEnemySounds();
    stopEndbossSounds();
    stopItemSounds();
    stopGameSounds();
}

/**
 * Stops all character-related sounds.
 */
function stopCharacterSounds() {
    let characterSounds = [
        world.character.walking_sound,
        world.character.jumpSound,
        world.character.hitCharacterSound,
        world.character.dieCharacterSound,
        world.character.sleepSound,
        world.character.attackSound,
        world.character.hurtSound,
        world.character.alertSound
    ];
    stopSounds(characterSounds);
}

/**
 * Stops all enemy-related sounds.
 */
function stopEnemySounds() {
    if (!world.level?.enemies) return;
    world.level.enemies.forEach(enemy => {
        let enemySounds = [enemy.walkingSound, enemy.deadSound, enemy.chickenSound, enemy.deathSound];
        stopSounds(enemySounds);
    });
}

/**
 * Stops all endboss-related sounds.
 */
function stopEndbossSounds() {
    if (!world.endboss) return;
    let endbossSounds = [
        world.endboss.endbossSound,
        world.endboss.alertSound,
        world.endboss.hurtSound,
        world.endboss.attackSound
    ];
    stopSounds(endbossSounds);
}

/**
 * Stops all item-related sounds.
 */
function stopItemSounds() {
    let itemSounds = [world.coinSound, world.bottleSound, world.splashBottleSound];
    stopSounds(itemSounds);
}

/**
 * Stops all general game-related sounds.
 */
function stopGameSounds() {
    let gameSounds = [world.winSound, world.loseSound];
    stopSounds(gameSounds);
}

/**
 * Pauses and resets all sounds in an array.
 * @param {HTMLAudioElement[]} sounds - Array of sounds to stop.
 */
function stopSounds(sounds) {
    sounds.forEach(sound => {
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    });
}

/**
 * Stops all active intervals in the game.
 */
function stopAllIntervals() {
    if (world?.intervals) {
        world.intervals.forEach(clearInterval);
        world.intervals = [];
    }
}

/**
 * Resets the game, stopping all sounds and intervals before reinitializing the world.
 */
function resetGame() {
    hideGameOverScreens();
    stopAllSounds();
    stopAllIntervals();
    clearEnemies();
    restartWorld();
}

/**
 * Hides game over and win screen overlays.
 */
function hideGameOverScreens() {
    document.getElementById('gameover_overlay').style.display = 'none';
    document.getElementById('winscreen_overlay').style.display = 'none';
}

/**
 * Clears all enemies from the world.
 */
function clearEnemies() {
    if (!world?.level?.enemies) return;
    world.level.enemies.forEach(enemy => enemy.isDead = true);
    world.level.enemies = [];
}

/**
 * Reinitializes the game world.
 */
function restartWorld() {
    world = null;
    initLevel();
    world = new World(canvas, keyboard);
    isGameStarted = true;
}
