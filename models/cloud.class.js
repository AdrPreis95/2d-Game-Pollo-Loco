/**
 * Represents a cloud in the background of the game.
 * Inherits from MoveableObject and continuously moves to the left.
 */
class Cloud extends MoveableObject {
    /** @type {number} Y position of the cloud */
    y = 20;

    /** @type {number} Width of the cloud */
    width = 500;

    /** @type {number} Height of the cloud */
    height = 250;

    /** @type {number} Speed of the cloud movement */
    speedX = 0.3; 

    /**
     * Creates a new Cloud instance with a random X position.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * canvas.width + canvas.width;
        this.startMoving();
    }

    /**
     * Starts the movement of the cloud to the left.
     */
    startMoving() {
        setInterval(() => {
            this.x -= this.speedX;
            if (this.x < -this.width) {
                this.x = canvas.width + Math.random() * 100;
            }
        }, 1000 / 60);
    }
}
