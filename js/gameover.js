/**
 * Win sound effect used when the player wins the game.
 * It is registered as background music but does not loop.
 */
const loseSound = new Audio('audio/gameover.mp3');
loseSound.loop = false;
soundManager.registerMusic(loseSound);

/**
 * Restarts the game by navigating to the main game page.
 */

function restartGameOver() {
    resetGame(); 
}

function quitGameOver() {
    document.getElementById("exit-overlay-gameover").style.display = "flex";
}
/**
 * Shows the User a Warning overlay 
 */
function tryCloseWindow() {
    console.log("Attempting to close the window");
    window.close();
}

function redirectToBlankGameOver() {
    let newTab = window.open("", "_blank");

    if (newTab) {
        newTab.document.write(`
            <html>
            <head>
                <title>Game Closed</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        background-color: #1a1a1a;
                        color: white;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    h1 {
                        color: #ffcc00;
                    }
                    p {
                        font-size: 20px;
                    }
                    button {
                        padding: 10px 20px;
                        font-size: 18px;
                        background-color: #ff3333;
                        color: white;
                        border: none;
                        cursor: pointer;
                        margin-top: 20px;
                    }
                    button:hover {
                        background-color: #cc0000;
                    }
                </style>
            </head>
            <body>
                <h1>⚠ Game Closed</h1>
                <p>Your browser has blocked automatic closing.</p>
                <p>Please close this window manually.</p>
                <button onclick="window.close()">Got it</button>
            </body>
            </html>
        `);
        newTab.document.close();
    } else {
        console.error("Cannot close ");
    }
}
