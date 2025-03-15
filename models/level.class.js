/**
 * Represents a game level.
 * Stores enemies, clouds, background objects, coins, and salsa bottles.
 */
class Level {
    /** @type {Enemy[]} Array of enemies in the level */
    enemies;

    /** @type {Cloud[]} Array of clouds in the level */
    clouds;

    /** @type {BackgroundObject[]} Array of background objects */
    backgroundObjects;

    /** @type {number} X-coordinate where the level ends */
    level_end_x = 2200;

    /** @type {Coin[]} Array of coins in the level */
    coins;

    /** @type {SalsaBottle[]} Array of salsa bottles in the level */
    salsaBottles;

    /**
     * Creates a new level instance.
     * @param {Enemy[]} enemies - Array of enemies in the level.
     * @param {Cloud[]} clouds - Array of clouds in the level.
     * @param {BackgroundObject[]} backgroundObjects - Array of background objects.
     * @param {Coin[]} coins - Array of coins in the level.
     * @param {SalsaBottle[]} salsaBottles - Array of salsa bottles in the level.
     */
    constructor(enemies, clouds, backgroundObjects, coins, salsaBottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.salsaBottles = salsaBottles;
    }
}
