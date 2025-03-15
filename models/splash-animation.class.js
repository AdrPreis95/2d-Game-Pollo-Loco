/**
 * Represents the splash effect when a salsa bottle hits an object.
 * Inherits from DrawableObject and animates the splash sequence.
 */
class BottleSplash extends DrawableObject {
    /** @type {string[]} Image paths for the splash animation */
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    /**
     * Creates a new BottleSplash instance at a given position.
     * @param {number} x - The x-coordinate of the splash effect.
     * @param {number} y - The y-coordinate of the splash effect.
     * @param {World} world - Reference to the game world.
     */
    constructor(x, y, world) {
        super();
        this.world = world;
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 260;
        this.width = 260;
        this.playSplashAnimation();
    }

    /**
     * Plays the splash animation and removes the effect after completion.
     */
    playSplashAnimation() {
        let i = 0;
        const interval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_SPLASH[i]];
            i++;
            if (i >= this.IMAGES_SPLASH.length) {
                clearInterval(interval);
                this.world.removeObject(this);
            }
        }, 100);
    }
}
