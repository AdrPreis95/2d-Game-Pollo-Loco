/**
 * Game world: rendering, collisions, collectibles and win/lose flow.
 */
window.World = class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinStatusBar;
    salsaBottleStatusBar = new SalsaBottleStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = [];
    dynamicObjects = [];
    coinsCollected = 0;
    bottlesCollected = 0;
    maxBottles = 5;
    endboss;
    coinSound = new Audio('audio/get-coin.mp3');
    bottleSound = new Audio('audio/get-bottle.mp3');
    splashBottleSound = new Audio('audio/bottle-splash.mp3');
    dieCharacterSound = new Audio('audio/die-character.mp3');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.isStopped = false;
        this.intervals = [];
        this.coinStatusBar = new CoinStatusBar();
        this.endbossStatusBar = new EndbossStatusBar();
        this.level = level1;
        this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss) || null;
        this.maxCoins = this.level.coins.length;
        this.setWorld();
        this.draw();
        this.run();
        if (window.soundManager) {
            soundManager.registerEffect(this.coinSound);
            soundManager.registerEffect(this.bottleSound);
            soundManager.registerEffect(this.splashBottleSound);
            soundManager.registerEffect(this.dieCharacterSound);
        }
    }

    startInterval(callback, time) {
        const interval = gameTimers.setInterval(callback, time);
        this.intervals.push(interval);
        return interval;
    }

    stopAllIntervals() {
        this.stop();
    }

    /**
     * Stops rendering, collisions and leftover entity sounds.
     */
    stop() {
        this.isStopped = true;
        window.isGameStarted = false;
        if (this.animationFrameId) {
            gameTimers.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.collisionInterval) {
            gameTimers.clearInterval(this.collisionInterval);
            this.collisionInterval = null;
        }
        this.intervals.forEach((id) => gameTimers.clearInterval(id));
        this.intervals = [];
        this.character?.stopWalkingSound?.();
        this.endboss?.stopAlertSound?.();
        this.level?.enemies?.forEach((enemy) => enemy.stopWalkingSound?.());
    }

    loadLevel(level) {
        this.level = level;
        this.maxCoins = level.coins.length;
        this.endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss) || this.endboss;
    }

    addObject(obj) {
        if (!this.dynamicObjects) this.dynamicObjects = [];
        this.dynamicObjects.push(obj);
    }

    removeObject(obj) {
        if (!this.dynamicObjects) return;
        const dynamicIndex = this.dynamicObjects.indexOf(obj);
        if (dynamicIndex > -1) {
            this.dynamicObjects.splice(dynamicIndex, 1);
            return;
        }
        const throwableIndex = this.throwableObjects.indexOf(obj);
        if (throwableIndex > -1) {
            this.throwableObjects.splice(throwableIndex, 1);
        }
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
        this.maxCoins = this.level.coins.length;
    }

    run() {
        this.collisionInterval = gameTimers.setInterval(() => {
            if (this.isStopped) return;
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.F && this.bottlesCollected > 0 && !this.throwCooldown) {
            const bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, this);
            this.throwableObjects.push(bottle);
            this.dynamicObjects.push(bottle);
            this.bottlesCollected--;
            this.updateSalsaBottleStatusBar();
            this.throwCooldown = true;
        }
        if (!this.keyboard.F) this.throwCooldown = false;
    }

    checkCollisions() {
        if (this.isStopped || this.isGameOverHandled) return;
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowableObjectCollisions();
        this.checkNormalEnemyCollisions();
        this.checkCharacterDeath();
    }

    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            const coin = this.level.coins[i];
            if (this.character.isColliding(coin) && !this.character.isOnGround()) {
                this.coinsCollected++;
                this.level.coins.splice(i, 1);
                this.coinSound.currentTime = 0;
                this.coinSound.play().catch(() => {});
                this.updateCoinStatusBar();
            }
        }
    }

    checkBottleCollisions() {
        this.level.salsaBottles.forEach((bottle, index) => {
            const margin = 40;
            const bottleLeft = bottle.x + margin;
            const bottleRight = bottle.x + bottle.width - margin;
            const bottleTop = bottle.y + margin;
            const bottleBottom = bottle.y + bottle.height - margin;
            const characterLeft = this.character.x;
            const characterRight = this.character.x + this.character.width;
            const characterTop = this.character.y;
            const characterBottom = this.character.y + this.character.height;
            if (
                characterLeft < bottleRight &&
                characterRight > bottleLeft &&
                characterTop < bottleBottom &&
                characterBottom > bottleTop
            ) {
                this.collectBottle(index);
            }
        });
    }

    collectBottle(index) {
        if (this.bottlesCollected < this.maxBottles) {
            this.bottlesCollected++;
            this.updateSalsaBottleStatusBar();
            this.bottleSound.currentTime = 0;
            this.bottleSound.play().catch(() => {});
        }
        this.level.salsaBottles.splice(index, 1);
    }

    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    this.handleBottleImpact(bottle, enemy, bottleIndex);
                }
            });
        });
    }

    handleBottleImpact(bottle, enemy, bottleIndex) {
        if (enemy instanceof Endboss) enemy.hit();
        this.throwableObjects.splice(bottleIndex, 1);
        this.splashBottleSound.currentTime = 0;
        this.splashBottleSound.play().catch(() => {});
        bottle.x = enemy.x + enemy.width / 2 - bottle.width / 2;
        bottle.y = enemy.y + enemy.height / 2 - bottle.height / 2;
    }

    checkNormalEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Chicken) && !(enemy instanceof SmallChicken)) {
                if (this.character.isColliding(enemy)) {
                    this.handleEnemyCollision(enemy);
                }
            }
        });
    }

    checkFastEnemyCollisions() {
        if (this.isStopped || this.isGameOverHandled) return;
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                if (this.character.isColliding(enemy)) {
                    this.handleEnemyCollision(enemy);
                }
            }
        });
    }

    handleEnemyCollision(enemy) {
        if (enemy.isDead) return;
        if (this.isFallingOnEnemy(enemy)) {
            this.handleMultipleEnemies();
        } else if (!this.character.isHurt()) {
            this.inflictCharacterDamage(enemy);
        }
    }

    handleMultipleEnemies() {
        const hitEnemies = this.getHitEnemies();
        if (hitEnemies.length === 0) return;
        const selectedEnemies = this.getValidEnemies(hitEnemies, 3);
        this.killSelectedEnemies(selectedEnemies);
    }

    getHitEnemies() {
        return this.level.enemies
            .filter((enemy) => this.isFallingOnEnemy(enemy) && !enemy.isDead)
            .sort((a, b) => {
                const aY = a.y + (a instanceof SmallChicken ? -10 : 0);
                const bY = b.y + (b instanceof SmallChicken ? -10 : 0);
                return aY - bY || Math.abs(this.character.x - a.x) - Math.abs(this.character.x - b.x);
            });
    }

    getValidEnemies(hitEnemies, maxHits) {
        const selectedEnemies = [hitEnemies[0]];
        for (let i = 1; i < hitEnemies.length && selectedEnemies.length < maxHits; i++) {
            const distanceX = Math.abs(hitEnemies[0].x - hitEnemies[i].x);
            const distanceY = Math.abs(hitEnemies[0].y - hitEnemies[i].y);
            if (distanceX < 50 && distanceY < 15) {
                selectedEnemies.push(hitEnemies[i]);
            }
        }
        return selectedEnemies;
    }

    killSelectedEnemies(selectedEnemies) {
        selectedEnemies.forEach((enemy) => this.damageOrKillEnemy(enemy));
        this.character.bounce(selectedEnemies[0]);
    }

    damageOrKillEnemy(enemy) {
        enemy.hitCount--;
        if (enemy.hitCount <= 0) enemy.die();
    }

    inflictCharacterDamage(enemy) {
        if (Math.abs(this.character.x - enemy.x) <= 100) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    checkCharacterDeath() {
        if (!this.character.isDead() || this.character.isDeathHandled) return;
        this.character.isDeathHandled = true;
        this.character.stopWalkingSound();
        this.character.playAnimation(this.character.IMAGES_DEAD);
        this.dieCharacterSound.currentTime = 0;
        this.dieCharacterSound.play().catch(() => {});
        gameTimers.setTimeout(() => this.gameOver(), 2000);
    }

    isFallingOnEnemy(enemy) {
        return (
            this.character.speedY < 0 &&
            this.character.y + this.character.height * 0.8 < enemy.y + enemy.height * 0.5
        );
    }

    updateCoinStatusBar() {
        if (this.maxCoins > 0) {
            this.coinStatusBar.setPercentage((this.coinsCollected / this.maxCoins) * 100);
        }
    }

    updateSalsaBottleStatusBar() {
        if (!this.salsaBottleStatusBar) return;
        this.salsaBottleStatusBar.setPercentage((this.bottlesCollected / this.maxBottles) * 100);
    }

    draw() {
        if (this.isStopped) return;
        this.clearCanvas();
        this.drawBackground();
        this.drawGameObjects();
        this.drawStatusBars();
        this.checkFastEnemyCollisions();
        this.requestNextFrame();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.salsaBottles);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.dynamicObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.salsaBottleStatusBar);
        this.addToMap(this.endbossStatusBar);
    }

    requestNextFrame() {
        this.animationFrameId = gameTimers.requestAnimationFrame(() => this.draw());
    }

    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    addObjectsToMap(objects) {
        if (!objects) return;
        objects.forEach((obj) => this.addToMap(obj));
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    gameOver() {
        if (this.isGameOverHandled) return;
        this.isGameOverHandled = true;
        this.character?.stopWalkingSound?.();
        this.endboss?.stopAlertSound?.();
        this.level?.enemies?.forEach((enemy) => enemy.stopWalkingSound?.());
        stopAllSounds();
        this.stop();
        this.clearEnemies();
        this.clearEndboss();
        if (window.gameTimers) gameTimers.clearAll();
        this.displayGameOverScreen();
        this.playLoseSound();
    }

    clearEnemies() {
        if (!this.level.enemies) return;
        this.level.enemies.forEach((enemy) => this.disableEnemy(enemy));
        this.level.enemies = [];
    }

    disableEnemy(enemy) {
        enemy.isDead = true;
        if (enemy.animationInterval) gameTimers.clearInterval(enemy.animationInterval);
        if (enemy.movementInterval) gameTimers.clearInterval(enemy.movementInterval);
        this.stopEnemySounds(enemy);
    }

    stopEnemySounds(enemy) {
        [enemy.walkingSound, enemy.deadSound].forEach((sound) => {
            if (!sound) return;
            sound.pause();
            sound.currentTime = 0;
        });
    }

    clearEndboss() {
        const endboss = this.endboss;
        if (!endboss) return;
        endboss.stopAlertSound?.();
        endboss.isDead = true;
        endboss.isAttacking = false;
        endboss.isAlerting = false;
        this.endboss = null;
    }

    displayGameOverScreen() {
        const gameOverOverlay = document.getElementById('gameover_overlay');
        if (gameOverOverlay) gameOverOverlay.style.display = 'flex';
    }

    playLoseSound() {
        if (!loseSound) return;
        loseSound.loop = false;
        loseSound.pause();
        loseSound.currentTime = 0;
        loseSound.volume = window.soundManager ? window.soundManager.musicVolume : 0.1;
        loseSound.play().catch(() => {});
    }
};
