/**
 * Represents a coin in the game.
 * Inherits from DrawableObject and can be collected by the player.
 */
class Coin extends DrawableObject {
    /**
     * Creates a new Coin instance at a specific position.
     * @param {number} x - The X-coordinate of the coin.
     * @param {number} y - The Y-coordinate of the coin.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/7_statusbars/3_icons/icon_coin.png');
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
    }
}
