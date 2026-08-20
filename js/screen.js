window.isGameStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    setupEnterScreen();
    setupStartButtons();
    setupSettingsMenu();
    setupExitMenu();
    setupInGameControls();
    setupOverlayHandle();
    checkRotateWarning();
});

window.addEventListener('resize', checkRotateWarning);
window.addEventListener('load', checkRotateWarning);

/**
 * First interaction unlocks intro music (browser autoplay policy).
 */
function setupEnterScreen() {
    const enterScreen = document.getElementById('enter_screen');
    const startScreen = document.getElementById('start_screen');
    const instructionScreen = document.getElementById('overlaycontainer-instructions');
    const introTheme = new Audio('audio/intro_theme.mp3');
    introTheme.loop = true;
    window.introTheme = introTheme;
    soundManager.registerMusic(introTheme, { loop: true });
    enterScreen.style.display = 'flex';

    const handleEnterScreen = (event) => {
        if (event.type === 'keydown' && event.key !== 'Enter') return;
        if (event.type === 'click' && event.target !== enterScreen) return;

        introTheme.play().catch(() => {});
        enterScreen.style.display = 'none';
        instructionScreen.style.display = 'flex';
        startScreen.style.display = 'flex';
        document.removeEventListener('keydown', handleEnterScreen);
        document.removeEventListener('click', handleEnterScreen);
    };

    document.addEventListener('keydown', handleEnterScreen);
    document.addEventListener('click', handleEnterScreen);
}

function setupStartButtons() {
    const playIcon = document.getElementById('play-icon');
    const startScreen = document.getElementById('start_screen');
    const loadingScreen = document.getElementById('loading_screen');
    const canvas = document.getElementById('canvas');
    const showSettingbutton = document.getElementById('overlay-handle');

    playIcon.addEventListener('click', () => {
        startScreen.style.display = 'none';
        loadingScreen.style.display = 'flex';

        setTimeout(() => {
            loadingScreen.style.display = 'none';
            canvas.style.display = 'block';
            showSettingbutton.style.display = 'flex';
            if (window.introTheme) {
                window.introTheme.pause();
                window.introTheme.currentTime = 0;
            }
            if (typeof window.initGame === 'function') {
                window.initGame();
            }
        }, 2000);
    });
}

window.closeInstructions = function () {
    if (!window.buttonSound) {
        window.buttonSound = new Audio('audio/buttons-feedback.mp3');
        soundManager.registerEffect(window.buttonSound);
    }
    window.buttonSound.currentTime = 0;
    window.buttonSound.play().catch(() => {});
    document.getElementById('game-instructions').style.display = 'none';
    document.getElementById('overlaycontainer-instructions').style.display = 'none';
    document.getElementById('imprintoverlay').style.display = 'flex';
    document.getElementById('imprintoverlay').style.zIndex = '99999';
};

function setupSettingsMenu() {
    const settingsIcon = document.getElementById('settings-icon');
    const settingsMenu = document.getElementById('settings-menu');
    const closeSettingsButton = document.getElementById('close-settings');
    if (!settingsIcon || !settingsMenu || !closeSettingsButton) return;

    settingsIcon.addEventListener('click', () => {
        settingsMenu.style.display = 'block';
    });
    closeSettingsButton.addEventListener('click', () => {
        settingsMenu.style.display = 'none';
    });
}

function setupExitMenu() {
    const exitIcon = document.getElementById('exit-icon');
    const exitMenu = document.getElementById('exit-menu');
    const exitConfirm = document.getElementById('exit-confirm');
    const exitCancel = document.getElementById('exit-cancel');
    if (!exitIcon || !exitMenu || !exitConfirm || !exitCancel) return;

    exitIcon.addEventListener('click', () => {
        exitMenu.style.display = 'block';
    });
    exitCancel.addEventListener('click', () => {
        exitMenu.style.display = 'none';
    });
    exitConfirm.addEventListener('click', () => {
        exitMenu.style.display = 'none';
        if (window.electron?.exitApp) {
            window.electron.exitApp();
        } else {
            window.close();
        }
    });
}

function setupInGameControls() {
    const canvas = document.getElementById('canvas');
    const fullscreenButton = document.getElementById('fullscreen-toggle');
    const exitButton = document.getElementById('exit-fullscreen');
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.getElementById('settings-menu');
    const touchControls = document.getElementById('touch-controls');
    const controls = document.querySelector('.controls');
    const showControlsButton = document.getElementById('show-control-buttons');
    const toggleSwitch = document.getElementById('toggleSwitch');
    if (!canvas) return;

    let controlsVisible = false;
    const topOffset = 170;
    const bottomOffset = 170;

    const isRestrictedSize = () => window.innerWidth >= 600 && window.innerHeight <= 699;

    const updateControlsVisibility = () => {
        const display = controlsVisible ? 'flex' : 'none';
        controls.style.display = display;
        touchControls.style.display = display;
    };

    const ensureControlsVisible = () => {
        if (controlsVisible) updateControlsVisibility();
        showControlsButton.style.display = 'flex';
    };

    const restoreCanvasSize = () => {
        canvas.style.removeProperty('width');
        canvas.style.removeProperty('height');
        canvas.style.position = 'absolute';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        ensureControlsVisible();
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().then(restoreCanvasSize).catch(() => {});
        } else {
            restoreCanvasSize();
        }
    };

    const toggleFullscreen = () => {
        if (isRestrictedSize()) {
            if (document.fullscreenElement) exitFullscreen();
            return;
        }
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                canvas.style.width = '100vw';
                canvas.style.height = `calc(100vh - ${topOffset + bottomOffset}px)`;
                canvas.style.position = 'absolute';
                canvas.style.top = `${topOffset}px`;
                canvas.style.bottom = `${bottomOffset}px`;
                canvas.style.left = '0';
                canvas.style.transform = 'none';
                ensureControlsVisible();
            }).catch(() => {});
        } else {
            exitFullscreen();
        }
    };

    const toggleSettingsMenu = () => {
        if (!settingsMenu) return;
        const hidden = settingsMenu.style.display === 'none' || settingsMenu.style.display === '';
        settingsMenu.style.display = hidden ? 'block' : 'none';
        if (hidden) {
            settingsMenu.style.position = 'fixed';
            settingsMenu.style.top = '50%';
            settingsMenu.style.left = '50%';
            settingsMenu.style.transform = 'translate(-50%, -50%)';
            settingsMenu.style.width = '300px';
            settingsMenu.style.background = 'rgba(0, 0, 0, 0.9)';
            settingsMenu.style.color = 'white';
            settingsMenu.style.padding = '20px';
            settingsMenu.style.borderRadius = '10px';
            settingsMenu.style.zIndex = '9999';
        }
    };

    showControlsButton.addEventListener('click', () => {
        controlsVisible = !controlsVisible;
        updateControlsVisibility();
    });
    toggleSwitch.addEventListener('change', () => {
        controlsVisible = toggleSwitch.checked;
        updateControlsVisibility();
    });
    fullscreenButton.addEventListener('click', toggleFullscreen);
    exitButton.addEventListener('click', exitFullscreen);
    settingsButton.addEventListener('click', toggleSettingsMenu);
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) restoreCanvasSize();
        ensureControlsVisible();
    });
    window.addEventListener('resize', () => {
        if (isRestrictedSize() && document.fullscreenElement) exitFullscreen();
    });
}

function setupOverlayHandle() {
    const handle = document.getElementById('overlay-handle');
    const button = document.getElementById('show-control-buttons');
    if (!handle || !button) return;

    handle.addEventListener('click', () => button.classList.toggle('active'));
    button.addEventListener('click', () => button.classList.remove('active'));
}

function checkRotateWarning() {
    const rotateWarning = document.getElementById('rotate-warning');
    if (!rotateWarning) return;
    const shouldShow = window.innerWidth < 600 && window.innerHeight < 900;
    rotateWarning.style.display = shouldShow ? 'flex' : 'none';
}

function showImprint() {
    const imprint = document.getElementById('imprintoverlay');
    imprint.style.display = 'flex';
    imprint.style.zIndex = '99999';
}

function closeImprint() {
    document.getElementById('imprintoverlay').style.display = 'none';
}
