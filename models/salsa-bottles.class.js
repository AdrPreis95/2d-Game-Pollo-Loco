/**
 * Represents a salsa bottle collectible in the game.
 * Inherits from DrawableObject and can be collected by the player.
 */
class SalsaBottle extends DrawableObject {
    /**
     * Creates a new SalsaBottle instance at a specific position.
     * @param {number} x - The X-coordinate of the salsa bottle.
     * @param {number} y - The Y-coordinate of the salsa bottle.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 150;
    }
}
