/**
 * Represents a general drawable object in the game.
 * All other objects (e.g., characters, enemies, status bars) inherit from this class.
 */
class DrawableObject {
    /** @type {number} X-coordinate of the object */
    x = 120;

    /** @type {number} Y-coordinate of the object */
    y = 280;

    /** @type {number} Height of the object */
    height = 120;

    /** @type {number} Width of the object */
    width = 90;

    /** @type {HTMLImageElement} Current image of the object */
    img;

    /** @type {Object.<string, HTMLImageElement>} Cache for loaded images */
    imageCache = {};

    /** @type {number} Index of the currently used image */
    currentImage = 0;

    /**
     * Loads a single image for the object.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the given canvas rendering context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
         * Draws a blue frame around the object if it is a Character or a Chicken.
         * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
         */
    drawFrame(ctx) {
        let debugMode = false;

        if (debugMode && (this instanceof Character || this instanceof Chicken)) {
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
         * Loads multiple images and stores them in the `imageCache` for faster retrieval.
         * @param {string[]} arr - An array of image paths.
         */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
