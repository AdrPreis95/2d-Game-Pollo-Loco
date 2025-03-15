/**
 * Represents the status bar displaying the player's health.
 * Inherits from DrawableObject and updates based on the player's health percentage.
 */
class StatusBar extends DrawableObject {
    /** @type {string[]} Image paths for different health states */
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    /**
     * Creates a new StatusBar instance with default position and full health.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 0;
        this.width = 150;
        this.height = 40;
        this.setPercentage(100);
    }

    /**
     * Updates the status bar display based on the current health percentage.
     * @param {number} percentage - The current health percentage (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the correct image index based on the current health percentage.
     * @returns {number} The index of the corresponding health image.
     */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;
        return 0;
    }
}
