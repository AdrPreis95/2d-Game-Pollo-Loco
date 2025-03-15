/**
 * Represents the status bar for collected coins.
 * Inherits from DrawableObject and displays progress using an image array.
 */
class CoinStatusBar extends DrawableObject {
    /** @type {string[]} Image paths for different coin status levels */
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    /**
     * Creates a new CoinStatusBar instance with default position and size.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 40;
        this.width = 150;
        this.height = 40;
        this.setPercentage(0);
    }

    /**
     * Updates the coin status display based on the given percentage.
     * @param {number} percentage - The current progress of collected coins (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let index = Math.floor((this.IMAGES.length - 1) * (percentage / 100));
        this.img = this.imageCache[this.IMAGES[index]];
    }
}
