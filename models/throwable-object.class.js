/**
 * Represents a throwable object, such as a salsa bottle, that can be thrown and animated.
 * Inherits from MoveableObject and interacts with gravity, rotation, and collision detection.
 */
class ThrowableObject extends MoveableObject {
    /** @type {string[]} Image paths for the bottle rotation animation */
    ROTATION_IMAGES = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    /**
     * Creates a new ThrowableObject instance.
     * @param {number} x - The X-coordinate where the object is thrown.
     * @param {number} y - The Y-coordinate where the object is thrown.
     * @param {World} world - The game world reference.
     */
    constructor(x, y, world) {
        super();
        this.world = world;
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.loadImages(this.ROTATION_IMAGES);
        this.throw();
    }

    /**
     * Initiates the throwing motion, applying gravity and rotation animation.
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();

        const rotationInterval = setInterval(() => {
            this.playAnimation(this.ROTATION_IMAGES);
            this.x += 10;

            if (this.y > 450 || this.hasCollidedWithTarget()) {
                clearInterval(rotationInterval);
                this.createSplash();
            }
        }, 50);
    }

    /**
     * Checks if the throwable object has collided with an enemy or the ground.
     * @returns {boolean} True if a collision has occurred.
     */
    hasCollidedWithTarget() {
        return (
            this.world.level.enemies.some(enemy => this.isColliding(enemy)) ||
            this.y > 450
        );
    }

    /**
     * Creates a splash effect when the throwable object hits an enemy or the ground.
     */
    createSplash() {
        const splash = new BottleSplash(this.x, this.y, this.world);
        this.world.addObject(splash);
        this.world.removeObject(this);
    }
}
