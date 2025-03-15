    /*** Represents the game world, managing the character, level, canvas rendering, and game mechanics*/
    window.World = class World {
    character = new Character();
    level = level1;
    ctx; canvas; keyboard; camera_x = 0;
    statusBar = new StatusBar();
    coinStatusBar; salsaBottleStatusBar = new SalsaBottleStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = []; dynamicObjects = [];
    coinsCollected = 0; bottlesCollected = 0; maxBottles = 5;
    endboss;
    coinSound = new Audio('audio/get-coin.mp3');
    bottleSound = new Audio('audio/get-bottle.mp3');
    splashBottleSound = new Audio('audio/bottle-splash.mp3');
    dieCharacterSound = new Audio('audio/die-character.mp3');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.coinStatusBar = new CoinStatusBar();
        this.endboss = new Endboss(this);
        this.endbossStatusBar = new EndbossStatusBar();
        this.level = level1;
        this.maxCoins = this.level.coins.length;
        this.loadLevel(level1);
        this.setWorld();
        this.draw();
        this.run();
        this.intervals = [];
        if (window.soundManager) {
            soundManager.registerEffect(this.coinSound);
            soundManager.registerEffect(this.bottleSound);
            soundManager.registerEffect(this.splashBottleSound);
            soundManager.registerEffect(this.dieCharacterSound);
        } else {
            console.error(" SoundManager fehlerhaft");}
    }

    /*** Starts the intervall, for stopping later*/
    startInterval(callback, time) { let interval = setInterval(callback, time); this.intervals.push(interval); return interval; }

    /*** Clears alle the Intervals */
    stopAllIntervals() { this.intervals.forEach(clearInterval); this.intervals = []; }

    /*** Loads the Level Coins */
    loadLevel(level) {
        this.level = level;
        this.maxCoins = level.coins.length;
        !this.level.enemies.find(e => e instanceof Endboss) && (this.endboss = new Endboss(this), this.level.enemies.push(this.endboss));
    }

    /*** Adds Objects for Throw (Bottles Coins and save it in Array)* @param {*} obj */
    addObject(obj) {
        if (!this.dynamicObjects) this.dynamicObjects = [];
        this.dynamicObjects.push(obj);
    }

    /*** Removes Objects for Throw (Bottles)* @param {*} obj */
    removeObject(obj) {
        if (!this.dynamicObjects) {
            return;
        }
        const index = this.dynamicObjects.indexOf(obj);
        if (index > -1) {
            this.dynamicObjects.splice(index, 1);
            return;
        }
        const throwableIndex = this.throwableObjects.indexOf(obj);
        if (throwableIndex > -1) {
            this.throwableObjects.splice(throwableIndex, 1);
            return;}
    }

    /*** Assigns the world instance to the character and all enemies.* Also sets the maximum number of coins in the level.*/
    setWorld() {
        this.character.world = this, this.level.enemies.forEach(enemy => enemy.world = this), this.maxCoins = this.level.coins.length;
      }
      
    run() {
        const loop = () => {
            this.checkFastEnemyCollisions();
            requestAnimationFrame(loop);};
        loop();
        setInterval(() => {
            this.checkCollisions(); 
            this.checkThrowObjects(); 
        }, 200);
    }

    /* * checks the picked up bottles and handles the statsbar */
    checkThrowObjects() {
        if (this.keyboard.F && this.bottlesCollected > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, this);
            this.throwableObjects.push(bottle);
            this.dynamicObjects.push(bottle);
            this.bottlesCollected--;
            this.updateSalsaBottleStatusBar();
        }
    }

    isFallingOnEnemy(enemy) {
        let characterBottom = this.character.y + this.character.height;
        let characterCenterX = this.character.x + this.character.width / 2;
        let enemyTop = enemy.y;
        let enemyLeft = enemy.x;
        let enemyRight = enemy.x + enemy.width;
        let fallingSpeedThreshold = -1; 

        return (
            this.character.speedY < fallingSpeedThreshold && 
            characterBottom >= enemyTop && characterBottom <= enemyTop + 10 && 
            characterCenterX >= enemyLeft && characterCenterX <= enemyRight);
    }

    getCharacterBottom() {
        return this.character.y + this.character.height;
    }

    getCharacterCenterX() {
        return this.character.x + this.character.width / 2;
    }

    getEnemyHitbox(enemy) {
        let enemyTop = enemy.y + enemy.height * 0.7;
        let enemyLeft = enemy.x - 5;
        let enemyRight = enemy.x + enemy.width + 5;
        if (enemy instanceof SmallChicken) {
            enemyTop = enemy.y + enemy.height * 0.85;
            enemyLeft = enemy.x - 15;
            enemyRight = enemy.x + enemy.width + 15;}
        return { enemyTop, enemyLeft, enemyRight };
    }

    getNearestEnemy() {
        let closestEnemy = null;
        let minDistance = Infinity;
        this.level.enemies.forEach(enemy => {
            let distance = Math.abs(this.character.x - enemy.x);
            let heightDiff = Math.abs(this.character.y - enemy.y);
            if (distance < minDistance && heightDiff < 50) {
                minDistance = distance;
                closestEnemy = enemy;}});
        return closestEnemy;
    }

    /*** Finds the enemy directly below the character.*/
    getEnemyBelow() {
        return this.level.enemies.find(enemy =>
            this.character.isColliding(enemy) &&
            this.character.y + this.character.height >= enemy.y &&
            this.character.y + this.character.height <= enemy.y + enemy.height * 0.6 &&
            Math.abs(this.character.x - enemy.x) < enemy.width * 0.5
        );
    }

    /*** Checks for all types of collisions in the game.*/
    checkCollisions() {
        if (this.isGameOverHandled) return;
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowableObjectCollisions();
        this.checkNormalEnemyCollisions();
        this.checkCharacterDeath();
    }

    /*** Checks if the character collides with coins.*/
    checkCoinCollisions() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            let coin = this.level.coins[i];
            if (this.character.isColliding(coin) && !this.character.isOnGround()) {
                this.coinsCollected++;
                this.level.coins.splice(i, 1);
                this.coinSound.play();
                this.updateCoinStatusBar();}}
    }
    /*** Checks if the character collides with bottles (m = margin ).*/
    checkBottleCollisions() {
        this.level.salsaBottles.forEach((b, i) => {
          const m = 40,
                bl = b.x + m, br = b.x + b.width - m,
                bt = b.y + m, bb = b.y + b.height - m,
                cl = this.character.x, cr = this.character.x + this.character.width,
                ct = this.character.y, cb = this.character.y + this.character.height;
          if (cl < br && cr > bl && ct < bb && cb > bt) this.collectBottle(i);});
      }
      
      /*** Handles bottle collection logic.* @param {number} index - The index of the collected bottle.*/
    collectBottle(index) {
        if (this.bottlesCollected < this.maxBottles) {
            this.bottlesCollected++;
            this.updateSalsaBottleStatusBar();
            this.bottleSound.play();}
        this.level.salsaBottles.splice(index, 1);
    }

    /** * Checks if thrown bottles hit enemies or the endboss.*/
    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    this.handleBottleImpact(bottle, enemy, bottleIndex); }});
        });
    }

    /*** Handles the impact of a thrown bottle on an enemy.*/
    handleBottleImpact(bottle, enemy, bottleIndex) {
        if (enemy instanceof Endboss) enemy.hit();
        this.throwableObjects.splice(bottleIndex, 1);
        this.splashBottleSound.play();
        bottle.x = enemy.x + enemy.width / 2 - bottle.width / 2;
        bottle.y = enemy.y + enemy.height / 2 - bottle.height / 2;
    }

    checkNormalEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (!(enemy instanceof Chicken) && !(enemy instanceof SmallChicken)) {
                if (this.character.isColliding(enemy)) {
                    this.handleEnemyCollision(enemy);}}
        });
    }

    checkFastEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                if (this.character.isColliding(enemy)) {
                    this.handleEnemyCollision(enemy);}
                }
        });
    }

    handleEnemyCollision(enemy) {
        if (enemy.isDead) return;

        if (this.isFallingOnEnemy(enemy)) {
            this.handleMultipleEnemies(enemy); 
        } else if (!enemy.isDead && !this.character.isHurt()) {
            this.inflictCharacterDamage(enemy);}
    }

    handleMultipleEnemies(enemy) {
        let maxHits = 3; 
        let hitEnemies = this.getHitEnemies(); 
        if (hitEnemies.length > 0) {
            let selectedEnemies = this.getValidEnemies(hitEnemies, maxHits); 
        this.killSelectedEnemies(selectedEnemies);}
    }
    
    /*** checks the hitbox of the smallchicken  */
    getHitEnemies() {
        return this.level.enemies
            .filter(e => this.isFallingOnEnemy(e) && !e.isDead)
            .sort((a, b) => {
                let aY = a.y + (a instanceof SmallChicken ? -10 : 0); 
                let bY = b.y + (b instanceof SmallChicken ? -10 : 0);
                return aY - bY || Math.abs(this.character.x - a.x) - Math.abs(this.character.x - b.x);
            });
    }
    
    /*** picked up the enemies, which should get hit */
    getValidEnemies(hitEnemies, maxHits) {
      let selectedEnemies = [hitEnemies[0]]; 
      for (let i = 1; i < hitEnemies.length && selectedEnemies.length < maxHits; i++) {
      let distanceX = Math.abs(hitEnemies[0].x - hitEnemies[i].x);
      let distanceY = Math.abs(hitEnemies[0].y - hitEnemies[i].y);
      let maxDistanceX = 50; 
      let maxDistanceY = 15; 
    
      if (distanceX < maxDistanceX && distanceY < maxDistanceY) {
      selectedEnemies.push(hitEnemies[i]);}}
      return selectedEnemies;
    }
    
    /*** checks the space between x,y and maked shoure the character inly jump once after hitt an enemy  */
    killSelectedEnemies(selectedEnemies) {
        selectedEnemies.forEach(e => this.damageOrKillEnemy(e)); 
        this.character.bounce(selectedEnemies[0]); 
    }
    
    /** * Damages or kills an enemy. */
    damageOrKillEnemy(enemy) { enemy.hitCount--; if (enemy.hitCount <= 0) enemy.die(); }

    /** * Resets the character's position to prevent floating issues.*/
    resetCharacterPosition() { this.character.y = 140; this.character.speedY = 0; }

    /** * Inflicts damage on the character if an enemy is in range.*/
    inflictCharacterDamage(enemy) {
        if (Math.abs(this.character.x - enemy.x) <= 100) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
            this.character.playHitSoundOnce();}
    }

    /** * Checks if the character is dead and handles the game over sequence. */
    checkCharacterDeath() {
        if (!this.character.isDead() || this.character.isDeathHandled) return;
        this.character.isDeathHandled = true;
        this.character.playAnimation(this.character.IMAGES_DEAD);
        this.dieCharacterSound.play();
        setTimeout(() => this.gameOver(), 2000);
    }

    /** * Checks , that the Character not glitches into an enemy   */
    isFallingOnEnemy(enemy) {
        return (
            this.character.speedY < 0 &&
            this.character.y + this.character.height * 0.8 < enemy.y + enemy.height * 0.5);
    }

    /*** Updates the coin status bar to reflect the percentage of collected coins. */
    updateCoinStatusBar() {
        if (this.maxCoins > 0) {
            const percentage = (this.coinsCollected / this.maxCoins) * 100;
            this.coinStatusBar.setPercentage(percentage);}
    }

    /** * updates our salsabottle statsbar  */
    updateSalsaBottleStatusBar() {
        if (this.salsaBottleStatusBar) {
            const percentage = (this.bottlesCollected / this.maxBottles) * 100;
            this.salsaBottleStatusBar.setPercentage(percentage);} 
            else {
            console.error("Fehler: salsaBottleStatusBar ist nicht definiert!");}
    }

    /** * this is our main draw method, which draws and show all objects in the canvas element*/
    draw() {
        this.clearCanvas();
        this.drawBackground();
        this.drawGameObjects();
        this.drawStatusBars();
        this.requestNextFrame();
    }

    /** * Clears the canvas before redrawing.*/
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /** * Draws the background objects with camera translation. */
    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    /** * Draws all game objects. */
    drawGameObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.drawSalsaBottles();
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.dynamicObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    /** * Draws all salsa bottles and logs their positions.*/
    drawSalsaBottles() {
        this.addObjectsToMap(this.level.salsaBottles);
        this.level.salsaBottles.forEach((bottle, index) => {});
    }

    /*** Draws all status bars. */
    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.salsaBottleStatusBar);
        this.addToMap(this.endbossStatusBar);
    }

    /** * Requests the next animation frame for continuous rendering. */
    requestNextFrame() {
        let self = this;
        requestAnimationFrame(() => self.draw());
    }

    /*** Draws a movable object (mo) onto the canvas.* If the object is facing the other direction, it flips the image before drawing.*/
    addToMap(mo) {
        if (mo.otherDirection) {
        this.flipImage(mo);}
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
        this.flipImageBack(mo);}
    }

    /** * Adds an array of objects to the game map by calling `addToMap` on each object.*/
    addObjectsToMap(objects) {
        objects.forEach((obj) => {
            this.addToMap(obj);});
    }

    /*** Flips the image (mirror-efect and flip it back )*/
    flipImage(mo) { this.ctx.save(); this.ctx.translate(mo.width, 0); this.ctx.scale(-1, 1); mo.x = mo.x * -1; }
    flipImageBack(mo) { mo.x = mo.x * -1; this.ctx.restore();}

    /*** Handles the game over sequence.*/
    gameOver() {
        if (this.isGameOverHandled) return;
        this.isGameOverHandled = true;
        stopAllSounds();
        stopAllIntervals();
        this.clearEnemies();
        this.clearEndboss();
        this.displayGameOverScreen();
        this.playLoseSound();
    }

    /*** Clears all enemies from the level. */
    clearEnemies() {
        if (!this.level.enemies) return;
        this.level.enemies.forEach(enemy => this.disableEnemy(enemy));
        this.level.enemies = [];
    }

    /*** Disables an enemy, stopping its animations and sounds. */
    disableEnemy(enemy) {
        enemy.isDead = true;
        if (enemy.animationInterval) clearInterval(enemy.animationInterval);
        if (enemy.movementInterval) clearInterval(enemy.movementInterval);
        this.stopEnemySounds(enemy);
    }

    /*** Stops all sounds associated with an enemy.*/
    stopEnemySounds(enemy) {
        let sounds = [enemy.walkingSound, enemy.deadSound, enemy.chickenSound, enemy.deathSound];
        sounds.forEach(sound => {
            if (sound) {
                sound.pause();
                sound.currentTime = 0;}
        });
    }

    /*** Clears the endboss and stops all its sounds and animations.*/
    clearEndboss() {
        if (!this.level.endboss) return;
        if (typeof this.level.endboss.die === "function") {
            this.level.endboss.die();
        }
        this.stopEndbossSounds();
        this.stopEndbossIntervals();
        this.level.endboss.isDead = true;
        this.level.endboss.isAttacking = false;
        this.level.endboss.isAlerting = false;
        setTimeout(() => {
            this.level.endboss = null;
        }, 100);
    }

    /*** Stops all endboss sounds.*/
    stopEndbossSounds() {
        [this.level.endboss.alertSound, this.level.endboss.attackSound, this.level.endboss.dieSound, this.level.endboss.hurtSound]
          .forEach(s => s && (s.pause(), s.currentTime = 0, s.loop = false));
      }
      
    /*** Stops all endboss-related intervals.*/
    stopEndbossIntervals() {
        if (this.level.endboss.animationInterval) clearInterval(this.level.endboss.animationInterval);
        if (this.level.endboss.movementInterval) clearInterval(this.level.endboss.movementInterval);
        if (this.level.endboss.soundInterval) clearInterval(this.level.endboss.soundInterval);
    }

    /*** Displays the game over overlay.*/
    displayGameOverScreen() {
        const gameOverOverlay = document.getElementById("gameover_overlay");
        if (gameOverOverlay) {
            gameOverOverlay.style.display = "flex";}
    }

    /*** Plays the lose sound when the game ends.*/
    playLoseSound() { if (!loseSound) return; loseSound.pause(), loseSound.currentTime = 0, loseSound.volume = 0.1, loseSound.play().catch(() => {}); }

}


