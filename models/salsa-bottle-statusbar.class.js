/**
 * Represents the status bar for collected salsa bottles.
 * Inherits from DrawableObject and displays progress using an image array.
 */
class SalsaBottleStatusBar extends DrawableObject {
    /** @type {string[]} Image paths for different status levels of the salsa bottle bar */
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
    ];

    /** @type {number} Percentage of collected salsa bottles (0-100) */
    percentage = 0;

    /**
     * Creates a new SalsaBottleStatusBar instance with default position and size.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10; 
        this.y = 80; 
        this.width = 150;
        this.height = 40;
        this.setPercentage(0);
    }

    /**
     * Updates the salsa bottle status bar based on the percentage of collected bottles.
     * @param {number} percentage - The current progress of collected salsa bottles (0-100).
     */
    setPercentage(percentage) {
        this.percentage = Math.min(percentage, 100);  
        
        let index = this.resolveImageIndex();  
        this.img = this.imageCache[this.IMAGES[index]];
    }
    
    /**
     * Determines the appropriate image index based on the current percentage.
     * @returns {number} Index of the corresponding status image from the `IMAGES` array.
     */
    resolveImageIndex() {
        if (this.percentage === 0) return 0;  
        if (this.percentage > 80) return 5;
        if (this.percentage > 60) return 4;
        if (this.percentage > 40) return 3;
        if (this.percentage > 20) return 2;
        return 1;  
    }
    
    
}
