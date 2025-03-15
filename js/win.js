/**
 * Win sound effect used when the player wins the game.
 * It is registered as background music but does not loop.
 */
const winSound = new Audio('audio/winsound.mp3');
winSound.loop = false;
soundManager.registerMusic(winSound);

/**
 * Restarts the game by navigating to the main game page.
 */

function restartGame() {
    resetGame()
}

/**
 * Exits the game and redirects to the start screen.
 */

function quitGame() {
    document.getElementById("exit-overlay").style.display = "flex";
}

/**
 * Shows the User a Warning overlay 
 */
function tryCloseWindow() {
    console.log("Attempting to close the window");
    window.close();


    setTimeout(() => {
        if (!window.closed) {
            console.warn(" The window could not be closed automatically.");
            document.getElementById("exit-overlay").innerHTML = `
                <p>⚠ Your browser does not allow automatic closing.</p>
                <p>Please close the window manually or click "Go to about:blank".</p>
                <button onclick="redirectToBlank()">Go to about:blank</button>
            `;
        }
    }, 500);
}

/**
 * If the user wants to switch to about blank 
 */
function redirectToBlank() {
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

