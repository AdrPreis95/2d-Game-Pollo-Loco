/**
 * Represents the status bar for the end boss's health.
 * Inherits from DrawableObject and displays the health percentage.
 */
class EndbossStatusBar extends DrawableObject {
    /** @type {string[]} Image paths for different health levels of the end boss */
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',  
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png', 
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png', 
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png', 
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png', 
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png' 
    ];

    /** @type {number} Health percentage of the end boss */
    percentage = 100;

    /**
     * Creates a new EndbossStatusBar instance with a default position and full health.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 120;
        this.width = 150;
        this.height = 40;
        this.setPercentage(100);
    }

    /**
     * Updates the status bar based on the current health of the end boss.
     * @param {number} percentage - The current health percentage of the end boss (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the appropriate image index for the current health status.
     * @returns {number} Index of the corresponding status image from the `IMAGES` array.
     */
    resolveImageIndex() {
        if (this.percentage > 80) return 5;  
        if (this.percentage > 60) return 4;  
        if (this.percentage > 40) return 3;  
        if (this.percentage > 20) return 2;  
        if (this.percentage > 0) return 1;   
        return 0;                            
    }
    
}
