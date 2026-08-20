/**
 * Manages game sound settings, including background music and sound effects.
 * Supports volume adjustment and saving preferences in localStorage.
 */
class SoundManager {
    constructor() {
        if (localStorage.getItem('musicVolume') === null) {
            localStorage.setItem('musicVolume', 1);
        }
        if (localStorage.getItem('effectsVolume') === null) {
            localStorage.setItem('effectsVolume', 1);
        }
        this.musicVolume = parseFloat(localStorage.getItem('musicVolume'));
        this.effectsVolume = parseFloat(localStorage.getItem('effectsVolume'));
        this.musicSounds = [];
        this.effectSounds = [];
        this.initVolumeControls();
        this.updateMusicVolume();
        this.updateEffectsVolume();
    }

    /**
     * Initializes volume sliders and restores stored values.
     */
    initVolumeControls() {
        const musicSlider = document.getElementById('volume-slider');
        const effectsSlider = document.getElementById('effects-volume-slider');
        if (musicSlider) {
            musicSlider.value = this.musicVolume * 100;
            musicSlider.addEventListener('input', (event) => {
                this.musicVolume = event.target.value / 100;
                this.updateMusicVolume();
                localStorage.setItem('musicVolume', this.musicVolume);
            });
        }
        if (effectsSlider) {
            effectsSlider.value = this.effectsVolume * 100;
            effectsSlider.addEventListener('input', (event) => {
                this.effectsVolume = event.target.value / 100;
                this.updateEffectsVolume();
                localStorage.setItem('effectsVolume', this.effectsVolume);
            });
        }
    }

    /**
     * Registers a music sound and applies the current music volume.
     * @param {HTMLAudioElement} sound - The music sound to register.
     * @param {{loop?: boolean}} [options]
     */
    registerMusic(sound, options = {}) {
        if (!sound) return;
        sound.loop = !!options.loop;
        sound.volume = this.musicVolume;
        if (!this.musicSounds.includes(sound)) {
            this.musicSounds.push(sound);
        }
    }

    /**
     * Registers an effect sound and applies the current effects volume.
     * @param {HTMLAudioElement} sound - The effect sound to register.
     * @param {{loop?: boolean}} [options]
     */
    registerEffect(sound, options = {}) {
        if (!sound) return;
        sound.loop = !!options.loop;
        sound.volume = this.effectsVolume;
        if (!this.effectSounds.includes(sound)) {
            this.effectSounds.push(sound);
        }
    }

    /**
     * Plays a sound if it is currently paused.
     * @param {HTMLAudioElement} sound
     * @param {{restart?: boolean}} [options]
     */
    play(sound, options = {}) {
        if (!sound) return;
        if (options.restart || sound.ended) {
            sound.currentTime = 0;
        }
        if (sound.paused) {
            sound.play().catch(() => {});
        }
    }

    /**
     * Pauses a sound and rewinds it to the start.
     * @param {HTMLAudioElement} sound
     */
    stop(sound) {
        if (!sound) return;
        sound.pause();
        try {
            sound.currentTime = 0;
        } catch (error) {
            /* some browsers throw if the file is not loaded yet */
        }
    }

    /**
     * Stops every registered sound. Persistent menu music can be excluded.
     * @param {HTMLAudioElement[]} [except]
     */
    stopAll(except = []) {
        [...this.musicSounds, ...this.effectSounds].forEach((sound) => {
            if (sound && !except.includes(sound)) {
                this.stop(sound);
            }
        });
    }

    /**
     * Stops gameplay audio and drops effect references so a restart
     * does not keep playing or leaking the previous world's sounds.
     */
    resetGameAudio() {
        this.effectSounds.forEach((sound) => this.stop(sound));
        this.musicSounds.forEach((sound) => {
            if (sound !== window.introTheme) {
                this.stop(sound);
            }
        });
        this.effectSounds = [];
    }

    /**
     * Updates the volume of all registered music sounds.
     */
    updateMusicVolume() {
        this.musicSounds.forEach((sound) => {
            if (sound) sound.volume = this.musicVolume;
        });
    }

    /**
     * Updates the volume of all registered effect sounds.
     */
    updateEffectsVolume() {
        this.effectSounds.forEach((sound) => {
            if (sound) sound.volume = this.effectsVolume;
        });
        if (window.currentEndboss && typeof window.currentEndboss.updateSoundVolumes === 'function') {
            window.currentEndboss.updateSoundVolumes();
        }
    }
}

if (!window.soundManager) {
    window.soundManager = new SoundManager();
}
