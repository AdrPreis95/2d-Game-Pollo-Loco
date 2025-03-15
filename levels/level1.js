/**
 * Initialize Level 1.
 */
function initLevel() {
    /**
     *  Array of all the coins 
     * @type {Coin[]}
     */
    const coins = [];

    /* Position of the coins */
    let startX = 300;
    let startY = 150;
    let spacingX = 150;
    let spacingY = 35;

    /* 3 coins per row  */
    for (let i = 0; i < 10; i++) {
        coins.push(new Coin(startX + i * spacingX, startY));
        coins.push(new Coin(startX + i * spacingX, startY + spacingY));
        coins.push(new Coin(startX + i * spacingX, startY + spacingY * 2));
    }

    /**
     * Array of alle the Salsabottles 
     * @type {SalsaBottle[]}
     */
    const salsaBottles = [
        new SalsaBottle(400, 300),
        new SalsaBottle(800, 250),
        new SalsaBottle(1200, 200),
        new SalsaBottle(1600, 300),
        new SalsaBottle(2000, 350),
        new SalsaBottle(2000, 350),
        new SalsaBottle(2000, 350),
        new SalsaBottle(2000, 350),
        new SalsaBottle(2000, 350),
        new SalsaBottle(2000, 350),
    ];

    /**
     * Sets Clouds, Enemies, Endboss, Backgroundobjects,coins,bottles
     * Die globale Variable `level1` wird überschrieben, um sie zurückzusetzen.
     */
    level1 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Endboss(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
        ],
        [
            new Cloud(),
        ],
        [
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/air.png', 719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),
            new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),
            new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),
        ],
        coins,
        salsaBottles
    );
}

/**
 * This function is for the restart , it restart alle the objects and positions of the level.
 */
function resetGame() {
    initLevel(); // 
    restartAllGameMechanics();
}

/**
 * Restarts the game mechanics (Timer ,Animations,Sounds-Intervals)
 * 
 */
function restartAllGameMechanics() {
    stopAllSounds();
    resetPlayerState();
    startGame();
}


initLevel();
