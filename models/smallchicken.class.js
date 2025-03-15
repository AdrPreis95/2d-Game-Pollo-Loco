/**
 * Represents a smaller variant of the Chicken enemy.
 * Inherits from Chicken and moves at a slower speed.
 */
class SmallChicken extends Chicken {
    hitCount = 0;

    constructor() {
        super();
        this.height = 50;
        this.width = 50;
        this.y = 360;
        this.x = this.getValidXPosition(800, 2400, 100); // Mindestabstand 100 Pixel
        this.speed = -0.1 - Math.random() * 0.1;
        this.otherDirection = false;

        this.IMAGES_WALKING = [
            'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ];

        this.IMAGES_DEAD = [
            'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
        ];

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        const interval = setInterval(() => {
            if (window.isGameStarted) {
                this.animate();
                clearInterval(interval);
            }
        }, 100);
    }
}