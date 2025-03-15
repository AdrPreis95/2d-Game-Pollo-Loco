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
     */
    registerMusic(sound) {
        sound.volume = this.musicVolume;
        this.musicSounds.push(sound);
    }

    /**
     * Registers an effect sound and applies the current effects volume.
     * @param {HTMLAudioElement} sound - The effect sound to register.
     */
    registerEffect(sound) {
        if (!sound) return;
        sound.volume = this.effectsVolume;
        this.effectSounds.push(sound);
    }

    /**
     * Updates the volume of all registered music sounds.
     */
    updateMusicVolume() {
        this.musicSounds.forEach(sound => sound.volume = this.musicVolume);
    }

    /**
     * Updates the volume of all registered effect sounds.
     */
    updateEffectsVolume() {
        this.effectSounds.forEach(sound => sound.volume = this.effectsVolume);

      
        if (!window.currentEndboss) {
            setTimeout(() => this.updateEffectsVolume(), 500);
            return;
        }
        if (typeof window.currentEndboss.updateSoundVolumes === "function") {
            window.currentEndboss.updateSoundVolumes();
        }
    }
}

if (!window.soundManager) {
    window.soundManager = new SoundManager();
}

