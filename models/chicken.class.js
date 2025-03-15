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
        this.walkingSound.volume = 0.05;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        // Generiere eine gültige X-Position mit Mindestabstand zu anderen Hühnern
        this.x = this.getValidXPosition(600, 1600, 100);
        this.speed = -0.15 - Math.random() * 0.2;
        this.otherDirection = false;

        const interval = setInterval(() => {
            if (window.isGameStarted) {
                this.animate();
                clearInterval(interval);
            }
        }, 100);

        if (window.soundManager) {
            soundManager.registerEffect(this.walkingSound);
            soundManager.registerEffect(this.deadSound);
        } else {
            console.error("SoundManager nicht gefunden");
        }
    }

    /**
     * generates a space between every chicken.
     */
    getValidXPosition(min, max, minDistance) {
        let x, isTooClose;
        do {
            x = min + Math.random() * (max - min);
            isTooClose = this.world?.level?.enemies?.some(enemy => Math.abs(enemy.x - x) < minDistance);
        } while (isTooClose); 
        return x;
    }

    die() {
        this.isDead = true;
        this.speed = 0;
        this.stopWalkingSound();
        this.deadSound.play();
        this.playAnimation(this.IMAGES_DEAD);

        setTimeout(() => {
            this.removeFromWorld();
        }, 1000);
    }

    removeFromWorld() {
        if (this.world && this.world.level && this.world.level.enemies) {
            const index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }
    }

    animate() {
        this.walkingInterval = setInterval(() => {
            if (!window.isGameStarted || this.isDead) return;
            this.x += this.otherDirection ? this.speed : this.speed;
            this.checkBoundaries();
            this.playWalkingSound();
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!window.isGameStarted || this.isDead) return;
            this.playAnimation(this.IMAGES_WALKING);
        }, 50);
    }

    checkBoundaries() {
        if (!this.world || !this.world.canvas) return;

        if (this.x <= 0) {
            this.otherDirection = true;
            this.speed = Math.abs(this.speed);
        }

        if (this.x + this.width >= this.world.canvas.width) {
            this.otherDirection = false;
            this.speed = -Math.abs(this.speed);
        }
    }

    playWalkingSound() {
        if (!this.walkingSound || this.isDead || !this.walkingSound.paused) return;
        this.walkingSound.play().catch(() => { });
    }

    stopWalkingSound() {
        if (this.walkingSound && !this.walkingSound.paused) {
            this.walkingSound.pause();
            this.walkingSound.currentTime = 0;
        }
    }
}