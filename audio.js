/* ==========================================================================
   OK Derby - Audio Engine
   ========================================================================== */

const AudioEngine = {
    isMuted: false,
    isMusicMuted: false,
    audioCtx: null,
    musicOscillator: null,
    musicGain: null,
    musicInterval: null,
    currentNote: 0,
    
    // Themes for different screens/levels
    themes: {
        main: {
            notes: [261.63, 0, 329.63, 0, 392.00, 0, 523.25, 0, 392.00, 0, 329.63, 0],
            type: 'sine',
            interval: 300,
            volume: 0.1
        },
        level1: {
            // Breezy major Hawaiian ukulele melody
            notes: [392.00, 261.63, 329.63, 440.00, 392.00, 261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 261.63],
            type: 'triangle',
            interval: 250,
            volume: 0.15
        },
        level2: {
            // Deep, syncopated Tiki marimba beats
            notes: [196.00, 220.00, 261.63, 0, 220.00, 261.63, 293.66, 0, 261.63, 293.66, 329.63, 0, 293.66, 261.63, 220.00, 196.00],
            type: 'triangle',
            interval: 180,
            volume: 0.12
        },
        level3: {
            // Fiery, dramatic volcanic tempo
            notes: [110.00, 0, 110.00, 164.81, 130.81, 0, 130.81, 196.00, 146.83, 0, 146.83, 220.00, 164.81, 196.00, 220.00, 0],
            type: 'triangle',
            interval: 140,
            volume: 0.14
        }
    },
    currentTheme: 'main',

    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        } catch (e) {
            console.warn("Web Audio API not supported");
        }
    },

    toggleSound() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    },

    toggleMusic() {
        this.isMusicMuted = !this.isMusicMuted;
        return this.isMusicMuted;
    },

    startMusic(theme = 'main') {
        if (!this.audioCtx) this.init();
        
        // Update current theme if a new one is provided and valid
        if (theme && this.themes[theme]) {
            this.currentTheme = theme;
        }

        if (this.isMusicMuted || !this.audioCtx) return;
        if (this.musicInterval) this.stopMusic();

        const themeData = this.themes[this.currentTheme];
        this.currentNote = 0;
        
        this.musicInterval = setInterval(() => {
            if (this.isMusicMuted) return;
            const freq = themeData.notes[this.currentNote % themeData.notes.length];
            if (freq > 0) this.playTone(freq, themeData.type, themeData.volume, themeData.interval / 1000 * 0.75, true);
            this.currentNote++;
        }, themeData.interval);
    },

    stopMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    },

    playTone(freq, type = 'square', vol = 0.1, dur = 0.1, isMusic = false) {
        if (!this.audioCtx || (isMusic ? this.isMusicMuted : this.isMuted)) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + dur);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + dur);
    },

    playSFX(sound) {
        if (this.isMuted) return;
        switch (sound) {
            case 'jump':
                this.playTone(400, 'sine', 0.3, 0.2);
                setTimeout(() => this.playTone(600, 'sine', 0.3, 0.3), 50);
                break;
            case 'shoot':
                this.playTone(800, 'triangle', 0.2, 0.1);
                setTimeout(() => this.playTone(400, 'triangle', 0.2, 0.1), 30);
                break;
            case 'hit':
                this.playTone(150, 'sawtooth', 0.4, 0.3);
                break;
            case 'bossHit':
                this.playTone(100, 'square', 0.5, 0.4);
                break;
            case 'birdUnlock':
                this.playTone(880, 'sine', 0.3, 0.2);
                setTimeout(() => this.playTone(988, 'sine', 0.3, 0.2), 100);
                setTimeout(() => this.playTone(1046, 'sine', 0.3, 0.4), 200);
                break;
            case 'wreck':
                this.playTone(80, 'sawtooth', 0.6, 0.5);
                setTimeout(() => this.playTone(60, 'square', 0.6, 0.5), 100);
                break;
            case 'boost':
                this.playTone(300, 'sawtooth', 0.2, 0.5);
                break;
            case 'deploy':
                this.playTone(300, 'sine', 0.3, 0.15);
                setTimeout(() => this.playTone(450, 'triangle', 0.25, 0.15), 60);
                setTimeout(() => this.playTone(600, 'sine', 0.3, 0.2), 120);
                setTimeout(() => this.playTone(750, 'triangle', 0.25, 0.25), 180);
                break;
            case 'collect':
                this.playTone(523.25, 'sine', 0.25, 0.08); // C5
                setTimeout(() => this.playTone(659.25, 'sine', 0.25, 0.08), 40); // E5
                setTimeout(() => this.playTone(783.99, 'sine', 0.25, 0.15), 80); // G5
                break;
            case 'villainDrop':
                this.playTone(420, 'sawtooth', 0.14, 0.08);
                setTimeout(() => this.playTone(260, 'triangle', 0.16, 0.11), 50);
                break;
            case 'bombExplode':
                this.playTone(110, 'sawtooth', 0.45, 0.25);
                setTimeout(() => this.playTone(65, 'square', 0.4, 0.3), 50);
                break;
            case 'villainStun':
                this.playTone(620, 'square', 0.22, 0.08);
                setTimeout(() => this.playTone(440, 'triangle', 0.22, 0.1), 60);
                setTimeout(() => this.playTone(280, 'sine', 0.24, 0.16), 120);
                break;
            case 'rivalWarning':
                this.playTone(740, 'square', 0.16, 0.09);
                setTimeout(() => this.playTone(880, 'square', 0.16, 0.12), 110);
                break;
        }
    }
};
