/**
 * Builds level 1: coins, bottles, enemies, clouds and background.
 */
function initLevel() {
    const coins = [];
    const startX = 300;
    const startY = 150;
    const spacingX = 150;
    const spacingY = 35;

    for (let i = 0; i < 10; i++) {
        coins.push(new Coin(startX + i * spacingX, startY));
        coins.push(new Coin(startX + i * spacingX, startY + spacingY));
        coins.push(new Coin(startX + i * spacingX, startY + spacingY * 2));
    }

    const salsaBottles = [
        new SalsaBottle(400, 300),
        new SalsaBottle(800, 250),
        new SalsaBottle(1200, 200),
        new SalsaBottle(1600, 300),
        new SalsaBottle(1850, 280),
        new SalsaBottle(2100, 350)
    ];

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

initLevel();
