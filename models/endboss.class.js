/**
 * Represents the Endboss in the game.
 * Inherits from MoveableObject and can move, attack, and die.
 */
class Endboss extends MoveableObject {
    /** @type {number} Height of the Endboss */
    height = 400;

    /** @type {number} Width of the Endboss */
    width = 250;

    /** @type {number} Y-position of the Endboss */
    y = 55;

    /** @type {boolean} Indicates whether the Endboss is attacking */
    isAttacking = false;

    /** @type {boolean} Indicates whether the Endboss is hurt */
    isHurt = false;

    /** @type {boolean} Indicates whether the Endboss is dead */
    isDead = false;

    /** @type {number} Health of the Endboss */
    energy = 100;

    /** @type {string[]} Image paths for the alert animation */
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    /** @type {string[]} Image paths for the attack animation */
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    /** @type {string[]} Image paths for the walking animation */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    /** @type {string[]} Image paths for the hurt animation */
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    /** @type {string[]} Image paths for the death animation */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /** @type {HTMLAudioElement} Alert sound */
    alertSound = new Audio('audio/endboss-alert.mp3');

    /** @type {HTMLAudioElement} Attack sound */
    attackSound = new Audio('audio/angry-chicken.mp3');

    /** @type {HTMLAudioElement} Hurt sound */
    hurtSound = new Audio('audio/endboss-hurt.mp3');

    /** @type {HTMLAudioElement} Death sound */
    dieSound = new Audio('audio/endboss-die.mp3');

    /**
     * Creates a new Endboss instance with a default position and animations.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        window.currentEndboss = this;

        if (window.soundManager) {
            this.alertSound.loop = true;
            window.soundManager.registerEffect(this.alertSound, { loop: true });
            window.soundManager.registerEffect(this.attackSound);
            window.soundManager.registerEffect(this.hurtSound);
            window.soundManager.registerEffect(this.dieSound);
        }

        this.animate();
    }

    updateSoundVolumes() {
        if (!window.soundManager) return;
        const volume = window.soundManager.effectsVolume;
        this.alertSound.volume = volume;
        this.attackSound.volume = volume;
        this.hurtSound.volume = volume;
        this.dieSound.volume = volume;
    }

    /**
     * Plays the alert sound of the Endboss as a loop while in range.
     */
    playAlertSound() {
        if (!window.isGameStarted || this.isDead || this.world?.isStopped) {
            this.stopAlertSound();
            return;
        }
        this.updateSoundVolumes();
        this.alertSound.loop = true;
        if (this.alertSound.paused) {
            this.alertSound.play().catch(() => {});
        }
    }

    stopAlertSound() {
        if (!this.alertSound || this.alertSound.paused) return;
        this.alertSound.pause();
        this.alertSound.currentTime = 0;
    }

    /**
     * Starts the animation logic of the Endboss.
     */
    animate() {
        this.movementInterval = gameTimers.setInterval(() => {
            if (!window.isGameStarted || this.world?.isStopped) {
                this.stopAlertSound();
                return;
            }
            this.handleMovement();
        }, 50);
    }

    /**
     * Controls the movement of the Endboss depending on the player's position.
     */
    handleMovement() {
        if (!window.isGameStarted || this.isDead || this.isHurt) return;
        if (!this.world || !this.world.character) return;
        const distanceToCharacter = Math.abs(this.world.character.x - this.x);
        if (distanceToCharacter < 500 && distanceToCharacter > 100) {
            this.playAlertSound();
            this.playAnimation(this.IMAGES_WALKING);
            this.x += this.world.character.x < this.x ? -3 : 3;
        } else if (distanceToCharacter <= 100) {
            this.stopAlertSound();
            this.attack();
        } else {
            this.stopAlertSound();
            this.playAnimation(this.IMAGES_ALERT);
        }
    }

    /**
     * Makes the Endboss perform an attack.
     */
    attack() {
        if (!window.isGameStarted || this.isAttacking || this.isDead) return;
        this.isAttacking = true;
        this.updateSoundVolumes();
        this.attackSound.currentTime = 0;
        this.attackSound.play().catch(() => {});
        this.playAnimation(this.IMAGES_ATTACK);
        if (this.world.character && Math.abs(this.world.character.x - this.x) < 100) {
            this.world.character.hit();
            this.world.statusBar.setPercentage(this.world.character.energy);
        }
        this.attackTimeout = gameTimers.setTimeout(() => {
            this.isAttacking = false;
        }, 1000);
    }

    /**
     * Reduces the health of the Endboss when hit.
     */
    hit() {
        if (!window.isGameStarted || this.isDead) return;
        this.energy -= 20;
        this.updateSoundVolumes();
        this.hurtSound.currentTime = 0;
        this.hurtSound.play().catch(() => {});
        if (this.world) {
            this.world.endbossStatusBar.setPercentage(this.energy);
        }
        if (this.energy <= 0) {
            this.die();
        } else {
            this.playAnimation(this.IMAGES_HURT);
        }
    }

    /**
     * Handles the endboss death sequence.
     */
    die() {
        if (this.isDeathHandled) return;
        this.isDeathHandled = true;
        this.isDead = true;
        this.stopAlertSound();
        this.stopCharacterActions();
        this.playDeathSound();
        this.playAnimation(this.IMAGES_DEAD);

        this.winTimeout = gameTimers.setTimeout(() => {
            window.isGameStarted = false;
            this.removeEnemyFromWorld();
            this.world?.character?.stopWalkingSound?.();
            this.world?.level?.enemies?.forEach((enemy) => enemy.stopWalkingSound?.());
            if (this.world) this.world.stop();
            if (window.gameTimers) gameTimers.clearAll();
            this.playWinSound();
            this.showWinScreen();
        }, 2000);
    }

    /**
     * Stops looping sounds related to the endboss fight.
     */
    stopCharacterActions() {
        if (this.world?.character) this.world.character.stopWalkingSound();
        this.stopAlertSound();
        if (this.attackSound) {
            this.attackSound.pause();
            this.attackSound.currentTime = 0;
        }
    }

    /**
     * Plays the endboss death sound.
     */
    playDeathSound() {
        this.updateSoundVolumes();
        this.dieSound.currentTime = 0;
        this.dieSound.play().catch(() => {});
    }

    /**
     * Removes the enemy from the world after death.
     */
    removeEnemyFromWorld() {
        if (!this.world?.level?.enemies) return;
        const index = this.world.level.enemies.indexOf(this);
        if (index > -1) this.world.level.enemies.splice(index, 1);
    }

    /**
     * Plays the win sound if available.
     */
    playWinSound() {
        if (!winSound) return;
        winSound.loop = false;
        winSound.volume = window.soundManager ? window.soundManager.musicVolume : 0.1;
        winSound.currentTime = 0;
        winSound.play().catch(() => {});
    }

    /**
     * Displays the win screen overlay.
     */
    showWinScreen() {
        const winScreenOverlay = document.getElementById("winscreen_overlay");
        if (winScreenOverlay) {
            winScreenOverlay.style.display = "flex";
        }
    }
}
