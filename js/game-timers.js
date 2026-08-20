/**
 * Tracks intervals, timeouts and animation frames so a game reset
 * can actually stop the previous run instead of leaving it playing.
 */
class GameTimers {
    constructor() {
        this.intervals = new Set();
        this.timeouts = new Set();
        this.rafs = new Set();
    }

    setInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.intervals.add(id);
        return id;
    }

    setTimeout(callback, delay) {
        const id = setTimeout(() => {
            this.timeouts.delete(id);
            callback();
        }, delay);
        this.timeouts.add(id);
        return id;
    }

    requestAnimationFrame(callback) {
        const id = requestAnimationFrame((timestamp) => {
            this.rafs.delete(id);
            callback(timestamp);
        });
        this.rafs.add(id);
        return id;
    }

    clearInterval(id) {
        clearInterval(id);
        this.intervals.delete(id);
    }

    clearTimeout(id) {
        clearTimeout(id);
        this.timeouts.delete(id);
    }

    cancelAnimationFrame(id) {
        cancelAnimationFrame(id);
        this.rafs.delete(id);
    }

    /**
     * Stops every tracked timer and also clears leftover native timers
     * that were started without going through this helper.
     */
    clearAll() {
        this.intervals.forEach((id) => clearInterval(id));
        this.timeouts.forEach((id) => clearTimeout(id));
        this.rafs.forEach((id) => cancelAnimationFrame(id));
        this.intervals.clear();
        this.timeouts.clear();
        this.rafs.clear();

        const highestInterval = setInterval(() => {}, 100000);
        for (let i = 1; i <= highestInterval; i++) {
            clearInterval(i);
        }
    }
}

window.gameTimers = new GameTimers();
