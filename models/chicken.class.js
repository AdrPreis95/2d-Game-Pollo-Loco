/**
 * Represents an enemy Chicken character in the game.
 * Inherits from MoveableObject and moves horizontally.
 */
class Chicken extends MoveableObject {
    y = 350;
    height = 80;
    width = 70;
    hitCount = 0;
    isDead = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ];

    constructor() {
        super();
        this.walkingSound = new Audio('audio/chicken-normal.mp3');
        this.deadSound = new Audio('audio/chicken-dead.mp3');
        this.walkingSound.loop = true;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = this.getValidXPosition(600, 1600, 100);
        this.speed = -0.15 - Math.random() * 0.2;
        this.otherDirection = false;
        this.hasStartedAnimating = false;

        this.startWhenGameReady();

        if (window.soundManager) {
            soundManager.registerEffect(this.walkingSound, { loop: true });
            soundManager.registerEffect(this.deadSound);
        }
    }

    /**
     * Waits until the game has started, then starts movement once.
     */
    startWhenGameReady() {
        if (window.isGameStarted) {
            this.animate();
            return;
        }
        this.startInterval = gameTimers.setInterval(() => {
            if (window.isGameStarted && !this.hasStartedAnimating) {
                this.animate();
                gameTimers.clearInterval(this.startInterval);
            }
        }, 100);
    }

    /**
     * generates a space between every chicken.
     */
    getValidXPosition(min, max, minDistance) {
        let x;
        let isTooClose;
        do {
            x = min + Math.random() * (max - min);
            isTooClose = this.world?.level?.enemies?.some(enemy => Math.abs(enemy.x - x) < minDistance);
        } while (isTooClose);
        return x;
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.speed = 0;
        this.stopWalkingSound();
        this.deadSound.currentTime = 0;
        this.deadSound.play().catch(() => {});
        this.playAnimation(this.IMAGES_DEAD);

        this.removeTimeout = gameTimers.setTimeout(() => {
            this.removeFromWorld();
        }, 1000);
    }

    removeFromWorld() {
        this.stopWalkingSound();
        if (this.walkingInterval) gameTimers.clearInterval(this.walkingInterval);
        if (this.animationInterval) gameTimers.clearInterval(this.animationInterval);
        if (this.world && this.world.level && this.world.level.enemies) {
            const index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }
    }

    animate() {
        if (this.hasStartedAnimating) return;
        this.hasStartedAnimating = true;

        this.walkingInterval = gameTimers.setInterval(() => {
            if (!window.isGameStarted || this.world?.isStopped || this.isDead) {
                this.stopWalkingSound();
                return;
            }
            this.x += this.speed;
            this.checkBoundaries();
            this.playWalkingSound();
        }, 1000 / 60);

        this.animationInterval = gameTimers.setInterval(() => {
            if (!window.isGameStarted || this.world?.isStopped || this.isDead) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 50);
    }

    checkBoundaries() {
        const minX = 0;
        const maxX = this.world?.level?.level_end_x || 2200;

        if (this.x <= minX) {
            this.otherDirection = true;
            this.speed = Math.abs(this.speed);
        }

        if (this.x + this.width >= maxX) {
            this.otherDirection = false;
            this.speed = -Math.abs(this.speed);
        }
    }

    playWalkingSound() {
        if (!this.walkingSound || this.isDead || !window.isGameStarted || this.world?.isStopped) {
            this.stopWalkingSound();
            return;
        }

        const character = this.world?.character;
        if (!character) return;

        const distance = Math.abs(character.x - this.x);
        if (distance > 450) {
            this.stopWalkingSound();
            return;
        }

        const hasNearerChicken = this.world.level?.enemies?.some((enemy) =>
            enemy instanceof Chicken &&
            !enemy.isDead &&
            enemy !== this &&
            Math.abs(character.x - enemy.x) < distance
        );
        if (hasNearerChicken) {
            this.stopWalkingSound();
            return;
        }

        this.walkingSound.loop = true;
        if (this.walkingSound.paused) {
            this.walkingSound.play().catch(() => {});
        }
    }

    stopWalkingSound() {
        if (!this.walkingSound || this.walkingSound.paused) return;
        this.walkingSound.pause();
        this.walkingSound.currentTime = 0;
    }
}
