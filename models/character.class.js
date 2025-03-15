/*** Represents the main playable character in the game.
 * Extends the MoveableObject class and includes animations, sounds, and movement logic.*/
class Character extends MoveableObject {
    /** @type {boolean} Flag to indicate if the death sequence has been handled. */
    isDeathHandled = false;
    /** @type {number} Character height in pixels. */
    height = 280;
    /** @type {number} Character width in pixels. */
    width = 160;
    /** @type {number} Initial Y-position of the character. */
    y = 140;
    /** @type {number} Movement speed of the character. */
    speed = 10;
    /**
     * @type {string[]} Array of Images Paths for our Character standing still Animation*/
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    /** 
     * @type {string[]} Array of image paths for the sleep animation.*/
    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /** *
     *  @type {string[]} Array of image paths for the walking animation.*/
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /** 
     * @type {string[]} Array of image paths for the jumping animation.*/
    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        'img/2_character_pepe/1_idle/idle/I-1.png',
    ];

    /*** @type {string[]} Array of image paths for the death animation.*/
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /*** @type {string[]} Array of image paths for the hurt animation. */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /** @type {any} Reference to the game world object. */
    world;
    /** @type {HTMLAudioElement} Audio element for walking sound effect. */
    walking_sound = new Audio('audio/walk.mp3');
    /** @type {HTMLAudioElement} Audio element for jumping sound effect. */
    jumpSound = new Audio('audio/jump.mp3');
    /** @type {HTMLAudioElement} Audio element for character hit sound effect. */
    hitCharacterSound = new Audio('audio/hit-chracter.mp3');
    /** @type {HTMLAudioElement} Audio element for character death sound effect. */
    dieCharacterSound = new Audio('audio/die-character.mp3');
    /** @type {HTMLAudioElement} Audio element for sleep effect. */
    // sleepSound = new Audio('audio/sleep-character.mp3');

    /** * Initializes the character, loads images, applies gravity, and starts animations. */
    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
        if (window.soundManager) {
            soundManager.registerEffect(this.walking_sound);
            soundManager.registerEffect(this.jumpSound);
            soundManager.registerEffect(this.hitCharacterSound);
            soundManager.registerEffect(this.dieCharacterSound);
            soundManager.registerEffect(this.sleepSound);
        } else {
            console.error("SoundManager fehler");
        }
    }

    /*** Starts all character animation intervals.*/
    animate() {
        this.startMovementCheck();
        this.startAnimationUpdate();
        this.startIdleCheck();
    }

    /*** Starts the interval for checking character movement. */
    startMovementCheck() {
        setInterval(() => {
            if (!isGameStarted || !this.world || !this.world.keyboard) return;
            this.updateMovement();
        }, 1000 / 60);
    }

    /** * Updates character movement based on keyboard input.*/
    updateMovement() {
        let moving = false;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveCharacter(true);
            moving = true;
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveCharacter(false);
            moving = true;
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            moving = true;
        }
        if (moving) this.world.camera_x = -this.x + 100;
    }

    /*** Moves the character left or right.*/
    moveCharacter(right) {
        if (right) {
            this.moveRight();
            this.otherDirection = false;
        } else {
            this.moveLeft();
            this.otherDirection = true;
        }
        this.playWalkingSound();
    }

    /*** Starts the interval for updating character animations.*/
    startAnimationUpdate() {
        setInterval(() => {
            if (!isGameStarted || !this.world || !this.world.keyboard) return;
            this.updateAnimation();
        }, 50);
    }

    /*** Handles the character's jump animation separately.*/
    handleJumpAnimation() {
        if (this.isAboveGround() && this.speedY > 0) {
            this.playAnimation(this.IMAGES_JUMPING);
        }
    }
    /*** clears the idle animation of the charqacrer(long idle)*/
    resetIdleState() {
        clearTimeout(this.idleTimer);
        this.idleTimer = null;
        this.currentAnimation = null;
        if (this.isSleeping) this.stopLongIdleAnimation();
    }

    handleIdleAnimation() {
        if (!this.idleTimer) {
            this.idleTimer = setTimeout(() => {
                if (!this.isCharacterMoving() && this.currentAnimation !== this.IMAGES_IDLE) {
                    this.playAnimation(this.IMAGES_IDLE);
                    this.currentAnimation = this.IMAGES_IDLE;
                }
            }, 1000);
        }
    }

    playAnimation(images) {
        if (this.currentAnimation === images) return;
        this.currentAnimation = images;
        let frameIndex = 0;
        clearInterval(this.animationInterval);
        let frameTime = 100;
        if (images === this.IMAGES_IDLE) frameTime = 150;
        else if (images === this.IMAGES_WALKING) frameTime = 90;
        else if (images === this.IMAGES_JUMPING) frameTime = 90;
        else if (images === this.IMAGES_LONG_IDLE) frameTime = 200;
        else if (images === this.IMAGES_HURT) frameTime = 90;
        else if (images === this.IMAGES_DEAD) frameTime = 150;
        this.animationInterval = setInterval(() => {
            if (this.currentAnimation !== images) {
                clearInterval(this.animationInterval);
                return;
            }
            this.img = this.imageCache[images[frameIndex]];
            frameIndex = (frameIndex + 1) % images.length;
        }, frameTime);
    }

    /** * Updates the character's animation based on its state. */
    updateAnimation() {
        if (this.isDead()) {
            this.handleCharacterDeath();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.handleJumpAnimation();
        } else {
            this.handleLandingAnimation();
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.handleIdleAnimation();
            }
        }
    }

    /** * Handles the Animation after landind */
    handleLandingAnimation() {
        if (!this.isAboveGround() && this.currentAnimation === this.IMAGES_JUMPING) {
            this.img = this.imageCache[this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1]];
            setTimeout(() => {
                if (!this.isCharacterMoving()) {
                    this.playAnimation(this.IMAGES_IDLE);
                } else {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }, 25);
        }
    }

    /*** Handles the character's death animation and game over trigger.*/
    handleCharacterDeath() {
        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => this.world.gameOver(), 5000);
    }

    /** * Starts the interval for checking if the character is idle.*/
    startIdleCheck() {
        setInterval(() => {
            if (!isGameStarted || !this.world || !this.world.keyboard) return;
            this.checkIdleState();
        }, 250);
    }

    /** * Checks if the character is idle and updates animation accordingly.*/
    checkIdleState() {
        if (this.isCharacterMoving()) {
            this.resetIdleState();
        } else {
            if (!this.idleTimer) {
                this.idleTimer = setTimeout(() => {
                    if (!this.isCharacterMoving() && this.currentAnimation !== this.IMAGES_LONG_IDLE) {
                        this.playLongIdleAnimation();
                    }
                }, 5000);
            }
        }
    }

    /*** Determines if the character is currently moving.*/
    isCharacterMoving() {
        return this.world.keyboard.RIGHT ||
            this.world.keyboard.LEFT ||
            this.isAboveGround() ||
            this.isHurt() ||
            this.isDead();
    }

    /*** Resets the idle state of the character.*/
    resetIdleState() {
        clearTimeout(this.idleTimer);
        this.idleTimer = null;
        if (this.isSleeping) this.stopLongIdleAnimation();
    }

    /** * Handles the idle animation when the character is not moving.*/
    handleIdleAnimation() {
        if (!this.idleTimer) {
            this.idleTimer = setTimeout(() => {
                if (!this.isCharacterMoving()) this.playLongIdleAnimation();
            }, 3000);
        }
        if (!this.isSleeping) this.playAnimation(this.IMAGES_IDLE);
    }

    /*** Determines if the character is on the ground.*/
    isOnGround() {
        return this.y >= 140;
    }

    /*** Starts the Long Idle Animation*/
    playLongIdleAnimation() {
        if (this.isSleeping) return;
        this.isSleeping = true;
        this.currentAnimation = this.IMAGES_LONG_IDLE;
        if (this.sleepSound) {
            this.sleepSound.play().catch(() => { });
        }
        let frameIndex = 0;
        clearInterval(this.longIdleInterval);
        this.longIdleInterval = setInterval(() => {
            if (!this.isSleeping || this.currentAnimation !== this.IMAGES_LONG_IDLE) {
                clearInterval(this.longIdleInterval);
                return;
            }
            this.img = this.imageCache[this.IMAGES_LONG_IDLE[frameIndex]];
            frameIndex = (frameIndex + 1) % this.IMAGES_LONG_IDLE.length;
        }, 200);
    }

    /** * Stops the Long Idle Animation */
    stopLongIdleAnimation() {
        this.isSleeping = false;
        this.currentAnimation = null;
        clearInterval(this.longIdleInterval);
        if (this.sleepSound) {
            this.sleepSound.pause();
            this.sleepSound.currentTime = 0;
        }
    }

    /*** Makes the character bounce when hitting an enemy. */
    bounce(enemy) {
        if (enemy instanceof SmallChicken) {
            this.speedY = 22;
        } else {
            this.speedY = 15;
        }
        this.smoothLanding(140, 200); // 🔥 Landet mit weichem Übergang
    }

    /*** Handles smooth landing after a bounce. */
    smoothLanding(landingTarget, landingDuration) {
        let startY = this.y;
        let startTime = performance.now();
        const animateLanding = () => {
            let elapsed = performance.now() - startTime;
            let progress = Math.min(elapsed / landingDuration, 1);
            this.y = startY + (landingTarget - startY) * progress;

            if (progress < 1) {
                requestAnimationFrame(animateLanding);
            } else {
                this.y = landingTarget;
                this.speedY = 0;
            }
        };

        requestAnimationFrame(animateLanding);
    }

    /*** Handles the character taking damage. */
    hit() {
        if (this.isDead()) return;
        const now = Date.now();
        if (this.isHurt()) return;
        this.lastHit = now;
        this.energy -= 20;
        this.playHitSoundOnce();
        if (this.energy <= 0) {
            this.energy = 0;
            this.die();
        }
    }

    /*** Handles the character's death. */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.stopCharacterProcesses();
        this.triggerDeathAnimation();
    }

    /*** Stops all sounds and intervals related to the character. */
    stopCharacterProcesses() {
        stopAllSounds();
        stopAllIntervals();
        if (this.animationInterval) clearInterval(this.animationInterval);
        if (this.movementInterval) clearInterval(this.movementInterval);
    }

    /*** Triggers the character's death animation and handles game over logic. */
    triggerDeathAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        if (this.dieCharacterSound) {
            this.dieCharacterSound.pause();
            this.dieCharacterSound.currentTime = 0;
            this.dieCharacterSound.volume = 0.3;
            this.dieCharacterSound.play().catch((error) => {
                console.error("Error playing death sound:", error);
            });
        } else {
            console.error("Death sound not found");
        }
        setTimeout(() => {
            isGameStarted = false;
            this.world.gameOver();
        }, 2000);
    }

    /*** Checks if the character is currently hurt.*/
    isHurt() {
        const now = Date.now();
        return now - this.lastHit < 1000;
    }

    /*** Plays the walking sound effect if the game has started and the sound is not already playing.*/
    playWalkingSound() {
        if (!isGameStarted || !this.walking_sound.paused) return;
        this.walking_sound.play().catch((error) => {
            console.error('Error while playing the walking sound:', error);
        });
    }

    /*** Makes the character jump by setting its vertical speed and playing the jump sound.*/
    jump() {
        this.speedY = 25;
        this.playJumpSound();
    }

    /** makes sure, that the gamesound only starts when the game start is clicked */
    playJumpSound() {
        if (!isGameStarted || !this.jumpSound.paused) return;
        this.jumpSound.play().catch(() => { }); // Fehler wird ignoriert
    }

    /*** plays the hitsound of the character one time and not in a row. */
    playHitSoundOnce() {
        if (!isGameStarted || !this.hitCharacterSound.paused) return;
        this.hitCharacterSound.play().catch(() => { }); // Fehler wird ignoriert
    }
}