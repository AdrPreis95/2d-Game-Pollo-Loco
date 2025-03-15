/*** Represents a movable object in the game.
 * Inherits from DrawableObject and can move, jump, apply gravity, and detect collisions.
 */
class MoveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity to the object, making it fall if above the ground.
     */
    applyGravity() {
        setInterval(() => {
            if (!this.isAboveGround() && this.speedY <= 0) {
                this.speedY = 0;
                this.isJumpingUp = false;
            } else {
                this.updateGravity();
            }
        }, 1000 / 25);
    }

    /**
     * Updates the object's position due to gravity.
     */
    updateGravity() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (this.speedY < 0) this.isJumpingUp = false;
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean} True if the object is above the ground, false otherwise.
     */
    isAboveGround() {
        return this instanceof ThrowableObject || this.y < 130;
    }

    /**
     * Checks if the object is colliding with another object.
     * @param {MoveableObject} mo - The object to check for collision.
     * @returns {boolean} True if a collision occurs, false otherwise.
     */
    isColliding(mo) {
        const { offsetX, offsetY } = this.getCollisionOffset(mo);
        const currentCollision = this.checkCollision(mo, offsetX, offsetY);
        const lastCollision = this.checkLastCollision(mo, offsetX, offsetY);
        this.lastX = this.x;
        this.lastY = this.y;
        return currentCollision || lastCollision;
    }

    /**
     * Returns the collision offset based on the object type.
     * @param {MoveableObject} mo - The object to check against.
     * @returns {{ offsetX: number, offsetY: number }} Collision offsets.
     */
    getCollisionOffset(mo) {
        if (mo instanceof SmallChicken) return this.getSmallChickenOffset(mo);
        if (mo instanceof Coin) return { offsetX: mo.width * 0.25, offsetY: mo.height * 0.25 };
        return { offsetX: 0, offsetY: 0 };
    }

    /**
     * Returns adjusted collision offsets for a SmallChicken.
     * @param {SmallChicken} mo - The SmallChicken object.
     * @returns {{ offsetX: number, offsetY: number }} Collision offsets.
     */
    getSmallChickenOffset(mo) {
        if (this.speedY > 0 && this.y + this.height * 0.8 < mo.y + mo.height * 0.5) {
            return { offsetX: -mo.width * 0.3, offsetY: -mo.height * 0.3 };
        } else if (this.speedY < 0) {
            return { offsetX: mo.width * -0.2, offsetY: mo.height * -0.2 };
        }
        return { offsetX: mo.width * 0.15, offsetY: mo.height * 0.15 };
    }

    /**
     * Checks current collision between objects.
     * @param {MoveableObject} mo - The object to check against.
     * @param {number} offsetX - Horizontal offset.
     * @param {number} offsetY - Vertical offset.
     * @returns {boolean} True if objects are colliding.
     */
    checkCollision(mo, offsetX, offsetY) {
        return this.x + this.width - offsetX > mo.x &&
            this.y + this.height - offsetY > mo.y &&
            this.x < mo.x + mo.width - offsetX &&
            this.y < mo.y + mo.height - offsetY;
    }

    /**
     * Checks the last position for collision detection.
     * @param {MoveableObject} mo - The object to check against.
     * @param {number} offsetX - Horizontal offset.
     * @param {number} offsetY - Vertical offset.
     * @returns {boolean} True if objects were colliding in the last frame.
     */
    checkLastCollision(mo, offsetX, offsetY) {
        return this.lastX + this.width - offsetX > mo.x &&
            this.lastY + this.height - offsetY > mo.y &&
            this.lastX < mo.x + mo.width - offsetX &&
            this.lastY < mo.y + mo.height - offsetY;
    }

    /**
     * Reduces the object's energy when hit.
     */
    hit() {
        this.energy = Math.max(0, this.energy - 5);
        if (this.energy > 0) this.lastHit = Date.now();
    }

    /**
     * Checks if the object is in a hurt state after being hit.
     * @returns {boolean} True if the object is hurt within the last 5 seconds, false otherwise.
     */
    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 5;
    }

    /**
     * Checks if the object is dead (energy depleted).
     * @returns {boolean} True if the object's energy is 0, false otherwise.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Plays an animation by cycling through an array of images.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        this.img = this.imageCache[images[this.currentImage % images.length]];
        this.currentImage++;
    }

    /**
     * Moves the object to the right.
     * @param {boolean} isTouch - Whether touch input is used.
     * @param {number | null} speedOverride - Custom speed value.
     */
    moveRight(isTouch = false, speedOverride = null) {
        this.x += speedOverride !== null ? speedOverride : this.speed;
    }

    /**
     * Moves the object to the left.
     * @param {boolean} isTouch - Whether touch input is used.
     * @param {number | null} speedOverride - Custom speed value.
     */
    moveLeft(isTouch = false, speedOverride = null) {
        this.x -= speedOverride !== null ? speedOverride : this.speed;
    }

    /**
     * Makes the object jump by setting an upward speed.
     */
    jump() {
        this.speedY = 30;
    }
}
