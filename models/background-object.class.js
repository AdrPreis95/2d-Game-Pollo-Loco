/**
 * Represents a background object that moves within the game.
 * Inherits from MoveableObject.
 */
class BackgroundObject extends MoveableObject {
    
    /** @type {number} Width of the background object */
    width = 720;

    /** @type {number} Height of the background object */
    height = 480;

    /**
     * Creates a new background object.
     * @param {string} imagePath - The path to the background image.
     * @param {number} x - The X-coordinate of the background object.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
