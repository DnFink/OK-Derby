/* ==========================================================================
   OK Derby - Core Game Engine
   ========================================================================== */

const Game = {
    canvas: null,
    ctx: null,
    
    // State
    gameState: 'menu',
    selectedVehicle: 'jeep', // jeep, speeder, tank
    villainDifficulty: 'medium', // easy, medium, hard
    villainConfigs: {
        easy: {
            name: 'Chill Rival',
            shortLabel: 'EASY',
            desc: 'Chill Rival — Relaxed pace with occasional bombs, traps & rival goons.',
            baseSpeed: 2.5,
            aheadSpeed: 1.6,
            behindSpeed: 4.1,
            dropMinCd: 150,
            dropMaxCd: 210,
            maxTraps: 4,
            maxGoons: 3,
            goonHp: 1,
            goonSpeed: 1.8,
            bombFuse: 135,
            stunDuration: 110,
            winBonus: 1500
        },
        medium: {
            name: 'Tiki Bandit',
            shortLabel: 'MED',
            desc: 'Tiki Bandit — Competitive pace with steady bombs, traps & rival goons.',
            baseSpeed: 3.5,
            aheadSpeed: 2.4,
            behindSpeed: 5.4,
            dropMinCd: 95,
            dropMaxCd: 145,
            maxTraps: 6,
            maxGoons: 5,
            goonHp: 1,
            goonSpeed: 2.4,
            bombFuse: 110,
            stunDuration: 85,
            winBonus: 2500
        },
        hard: {
            name: 'Baron Kahuna',
            shortLabel: 'HARD',
            desc: 'Baron Kahuna — Blistering speed, frequent bombs, traps & armored goons!',
            baseSpeed: 4.5,
            aheadSpeed: 3.3,
            behindSpeed: 6.8,
            dropMinCd: 55,
            dropMaxCd: 90,
            maxTraps: 8,
            maxGoons: 7,
            goonHp: 2,
            goonSpeed: 3.0,
            bombFuse: 85,
            stunDuration: 60,
            winBonus: 4000
        }
    },
    score: 0,
    levelStartScore: 0,
    lives: 3,
    levelIndex: 1,
    
    // Level & Physics
    scrollX: 0,
    cameraTargetX: 0,
    cellSize: 40,
    levelBlocks: [],
    swampGaps: [],
    ramps: [],
    bgBirds: [],
    collectibles: [],
    volcanoVents: [],
    elevators: [],
    qblocks: [],
    hazards: [],
    
    // Entities
    player: {
        x: 100, y: 100, w: 60, h: 40,
        vx: 0, vy: 0,
        speedCap: 6.8, accel: 0.24, friction: 0.95,
        jumpForce: 12.5,
        maxJumps: 2,
        jumpsRemaining: 2,
        jumpGraceTimer: 0,
        projectileDamage: 1,
        maxProjectiles: 3,
        specialDuration: 300,
        isGrounded: false,
        isBoosting: false,
        wheelRot: 0,
        isFlying: false,
        flyTimer: 0, // seconds left
        dead: false,
        isInvincible: false,
        invincibilityTimer: 0,
        lastSafeX: null,
        lastSafeY: null,
        specialReady: true,
        specialActive: false,
        specialTimer: 0
    },
    
    boss: null,
    bossDefeated: false,
    bossSpawnX: 0,
    bossSpawnY: 0,
    minions: [],
    bossPineapples: [],
    coconutBombs: [],
    pineappleBubbles: [],
    birdCage: null,
    particles: [],
    globalFrame: 0,
    tikiSpikes: [],
    tikiTotems: [],
    tikiFireJets: [],
    villain: null,
    villainBombs: [],
    villainTraps: [],
    villainWarningPlayed: false,
    
    // Input
    keys: {},
    
    // Level maps (368 cols x 12 rows)
    // S = Solid wood post
    // / = Ramp Up
    // \ = Ramp Down
    // ~ = Water / Lava (gap)
    // B = Boss
    // E = End Goal
    // P = Pineapple collectible
    // C = Coconut collectible
    // V = Volcano steam vent (Stage 3 launcher)
    // * = Tiki Spikes
    // # = Tiki Totem
    // T = Tiki Fire Jet
    // ^ = Elevator
    levels: {
        1: [
            "................................................................................................................................................................................................................................................................................................................................................................................",
            "................................................................................................................................................................................................................................................................................................................................................................................",
            "............................................................................................?........................................................................................................................?..........................................................................................................................................................",
            "................................................................................................................................................................................................................................................................................................................................................................................",
            "...................................................................................M........m........M......................................................................................................M........m........M...................................................................P....P....P....P....P....P....P....P....P....P....P....P....P....P....P.......",
            "............................................................................SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....................SSSSSSSS\\........................................................SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....................SSSSSSSS\\..........................................................................................................",
            ".............................................P.P.P...........................................................................................\\........................P.P.P...........................................................................................\\.................B...........C....C....C....C....C....C....C....C....C....C....C....C....C....C..........",
            ".......................?.....................C.C.C............................................................................................\\.......................C.C.C............................................................................................\\........................................................................................................",
            ".............................................*.................................................................................................\\......................*.................................................................................................\\.......................................................................................................",
            "....1..........*..........#.....#....../SSSSSSSSSSSSS..*.............../...^....m....T....#..*.....#..........#.......T......................./.\\.*.....*......./SSSSSSSSSSSSSm..*............../...^....m....T....*........*..........*.......T...m.....................\\..*..................../../............/../............/../............/../........../../........E....",
            "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.SSSSSSSSSSSSSSSSSSSS.......SSSSSSSS...SSSSSSSSSSSSSSSSSSSSSSSSS...SSSSSSSSSSSSSSSSSSS.......SSSSSSSSS.SSSSSSS.SSSSSSSSSS.SSSSSSSSSSSSSSSSSSSS.......SSSSSSSS...SSSSSSSSSSSSSSSSSSSSSSSSS...SSSSSSSSSSSSSSSSSSS.......SSSSSSSSS.SSSSSSSSSSSSSSSSSSSSSS.....SSSS............SSSS............SSSS............SSSS..........SSSS.....SSSSSSS.",
            "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        ],
        2: [
            "................................................................................................................................................................................................................................................................................................................................................................................",
            "................................................................................................................................................................................................................................................................................................................................................................................",
            "............................................................................................?........................................................................................................................?..........................................................................................................................................................",
            "................................................................................................................................................................................................................................................................................................................................................................................",
            "...................................................................................M........m........M......................................................................................................M........m........M...................................................................P....P....P....P....P....P....P....P....P....P....P....P....P....P....P.......",
            "............................................................................SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....................SSSSSSSS\\........................................................SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....................SSSSSSSS\\..................B.......................................................................................",
            ".............................................................................................................................................\\........................................................................................................................\\.............................C....C....C....C....C....C....C....C....C....C....C....C....C....C..........",
            ".......................?.....................P.P.P............................................................................................\\.......................P.P.P............................................................................................\\........................................................................................................",
            ".............................................C.C.C.............................................................................................\\......................C.C.C.............................................................................................\\.............................SSS.............SSS.............SSS.............SSS.......................",
            "....1..........*........##......T....../SSSSSSSSSSSSS................../mT.^..........*..#........##........*......T......*............#....../.\\.T...*.T......./SSSSSSSSSSSSSm................./.T.^...m........*..*.......##........*......T...m.............*.........\\.*......T....*..............SSS.............SSS.............SSS.............SSS..................E....",
            "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.SSSSSSSSSSSSSSSSSSSS.......SSSSSSSS...SSSSSSSSSSSSSSSSSSSSSSSSS...SSSSSSSSSSSSSSSSSSS.......SSSSSSSSS.SSSSSSS.SSSSSSSSSS.SSSSSSSSSSSSSSSSSSSS.......SSSSSSSS...SSSSSSSSSSSSSSSSSSSSSSSSS...SSSSSSSSSSSSSSSSSSS.......SSSSSSSSS.SSSSSSSSSSSSSSSSSSSSSS......SSS.....SSS.....SSS.....SSS.....SSS.....SSS.....SSS.....SSS.....SSS...SSSSSSS.",
            "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
        ],
        3: [
            "................................................................................................................................................................................................................................................................................................................................................................................",
            "................................................................................................................................................................................................................................................................................................................................................................................",
            "............................................................................................?........................................................................................................................?..........................................................................................................................................................",
            "................................................................................................................................................................................................................................................................................................................................................................................",
            "...................................................................................M........m........M......................................................................................................M........m........M...................................................................P....P....P....P....P....P....P....P....P....P....P....P....P....P....P.......",
            "............................................................................SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....................SSSSSSSS\\........................................................SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....................SSSSSSSS\\..........................................................................................................",
            ".............................................................................................................................................\\........................................................................................................................\\.................B...........C....C....C....C....C....C....C....C....C....C....C....C....C....C..........",
            ".......................?.....................P.P.P............................................................................................\\.......................P.P.P............................................................................................\\........................................................................................................",
            ".............................................C.C.C.............................................................................................\\......................C.C.C.............................................................................................\\.......................................................................................................",
            "....1........*........T.........#....../SSSSSSSSSSSSSSS.*............../...^......*...T........#....*.........T.......*......................./.\\.T.....*......./SSSSSSSSSSSSSSSm.*............./...^.....*....T......m...#...*.......m....T......*......................\\..T.....*................VV..............VV..............VV..............VV............VV........E....",
            "SSSSSSSSSSSSSSSSSS..SSSSS...SSSSSSSSSS.SSSSSSSSSSSSSSSSSSSS.......SSSSSSSS...SSSSSSSSSSSS..SSSSSSSSSSSS..SSSSSSSSSSSSSSSSSSS..SSSSSSSSS.SSSS.SSSSSSS.SSSSSSSSSS.SSSSSSSSSSSSSSSSSSSS.......SSSSSSSS...SSSSSSSSSSSS..SSSSSSSSSSSS..SSSSSSSSSSSSSSSSSSS..SSSSSSSSS.SSSS.SSSSSSSSSSSSSSSSSSSSSS......SSSS............SSSS............SSSS............SSSS..........SSSS....SSSSSSS.",
            "~~~~~~~~~~~~~~~~~~VV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VV~~~~~~~~~~~~~~~~~~~~~~~~~~~VV~~~~~~~~~~~~VV~~~~~~~~~~~~~~~~~~~VV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VV~~~~~~~~~~~~~~~~~~~~~~~~~~~VV~~~~~~~~~~~~VV~~~~~~~~~~~~~~~~~~~VV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~"
        ]
    },

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        AudioEngine.init();
        try {
            const savedDiff = window.localStorage && window.localStorage.getItem('okDerbyVillainDifficulty');
            if (savedDiff && this.villainConfigs[savedDiff]) {
                this.villainDifficulty = savedDiff;
            }
        } catch (e) {}
        this.bindEvents();
        this.setVillainDifficulty(this.villainDifficulty);
        AudioEngine.startMusic('main');
        
        // Menu animation loop
        setInterval(() => {
            if (this.gameState === 'menu' || this.gameState === 'character_select') {
                this.updateMenuCanvases();
            }
        }, 50);

        requestAnimationFrame((t) => this.loop(t));
    },

    triggerJump() {
        if (this.gameState !== 'playing' || this.player.isFlying || this.player.dead) return;

        if (this.player.isGrounded) {
            this.player.vy = -this.player.jumpForce;
            this.player.isGrounded = false;
            this.player.jumpsRemaining = this.player.maxJumps - 1;
            this.player.jumpGraceTimer = 6;
            AudioEngine.playSFX('jump');
        } else if (this.player.jumpsRemaining > 0) {
            // Mid-air double jump!
            this.player.vy = -this.player.jumpForce * 0.92;
            this.player.jumpsRemaining = 0;
            this.player.jumpGraceTimer = 6;
            AudioEngine.playSFX('doubleJump');
            for (let p = 0; p < 12; p++) {
                this.particles.push({
                    x: this.player.x + this.player.w * (0.2 + Math.random() * 0.6),
                    y: this.player.y + this.player.h,
                    vx: (Math.random() - 0.5) * 6,
                    vy: 1.5 + Math.random() * 3,
                    life: 20,
                    color: p % 2 === 0 ? '#ffffff' : '#fdcb6e'
                });
            }
        }
    },

    bindEvents() {
        window.addEventListener('keydown', e => {
            // Prevent default behavior for game keys (scrolling and button triggering)
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
            
            this.keys[e.key] = true;
            this.keys[e.code] = true;
            if (e.key === 'Escape') this.togglePause();
            if ((e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X') && this.gameState === 'playing') {
                this.shootCoconutBomb();
            }
            if ((e.key === 'f' || e.key === 'F' || e.key === 'z' || e.key === 'Z') && this.gameState === 'playing') {
                this.shootPineappleBubble();
            }
            if ((e.key === 'q' || e.key === 'Q') && this.gameState === 'playing') {
                this.deploySpecialRescue();
            }
            if ((e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') && this.gameState === 'playing' && !e.repeat) {
                this.triggerJump();
            }
        });
        window.addEventListener('keyup', e => {
            this.keys[e.key] = false;
            this.keys[e.code] = false;
        });

        document.getElementById('btn-campaign').addEventListener('click', () => this.showScreen('level-select-screen'));
        document.getElementById('btn-select-character').addEventListener('click', () => this.showScreen('character-select-screen'));
        document.getElementById('btn-how-to-play').addEventListener('click', () => this.showScreen('how-to-play-screen'));
        
        document.querySelectorAll('.btn-back').forEach(btn => {
            btn.addEventListener('click', () => this.showScreen(btn.dataset.target));
        });

        // Character select
        const cards = document.querySelectorAll('.char-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.selectedVehicle = card.dataset.character;
            });
        });

        // Villain Difficulty buttons (Main Menu & Level Select stay synced)
        document.querySelectorAll('.btn-diff').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset && btn.dataset.difficulty) {
                    this.setVillainDifficulty(btn.dataset.difficulty);
                }
            });
        });

        document.getElementById('btn-confirm-character').addEventListener('click', () => this.showScreen('main-menu-screen'));

        // Level start from Level Select screen (resets score to 0)
        document.querySelectorAll('.btn-start-level').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.level-card');
                this.score = 0;
                this.levelStartScore = 0;
                this.startLevel(parseInt(card.dataset.level), true);
            });
        });

        // Pausing & Game Over
        document.getElementById('btn-game-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-resume-game').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-restart-level').addEventListener('click', () => {
            this.score = this.levelStartScore;
            this.startLevel(this.levelIndex, false);
        });
        document.getElementById('btn-retry-level').addEventListener('click', () => {
            this.score = this.levelStartScore;
            this.startLevel(this.levelIndex, false);
        });
        document.getElementById('btn-pause-exit').addEventListener('click', () => this.showScreen('main-menu-screen'));
        document.getElementById('btn-gameover-exit').addEventListener('click', () => this.showScreen('main-menu-screen'));
        document.getElementById('btn-victory-exit').addEventListener('click', () => this.showScreen('main-menu-screen'));
        document.getElementById('btn-game-exit').addEventListener('click', () => this.showScreen('main-menu-screen'));
        document.getElementById('btn-next-level').addEventListener('click', () => {
            if (this.levels[this.levelIndex + 1]) {
                this.levelStartScore = this.score;
                this.startLevel(this.levelIndex + 1, true);
            } else {
                this.showScreen('level-select-screen'); // Completed campaign
            }
        });
        
        const soundBtn = document.getElementById('btn-toggle-global-sound');
        soundBtn.addEventListener('click', () => {
            const muted = AudioEngine.toggleSound();
            soundBtn.classList.toggle('muted', muted);
            const icon = soundBtn.querySelector('i');
            if (icon) {
                icon.className = muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-up';
            }
        });

        const musicBtn = document.getElementById('btn-toggle-global-music');
        musicBtn.addEventListener('click', () => {
            const muted = AudioEngine.toggleMusic();
            musicBtn.classList.toggle('muted', muted);
            if (muted) AudioEngine.stopMusic();
            else AudioEngine.startMusic();
        });
    },

    getVillainConfig() {
        return this.villainConfigs[this.villainDifficulty] || this.villainConfigs.medium;
    },

    setVillainDifficulty(diff) {
        if (!this.villainConfigs[diff]) return;
        this.villainDifficulty = diff;
        try {
            if (window.localStorage) {
                window.localStorage.setItem('okDerbyVillainDifficulty', diff);
            }
        } catch (e) {}

        document.querySelectorAll('.btn-diff').forEach(btn => {
            if (btn.dataset && btn.dataset.difficulty === diff) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const descEl = document.getElementById('difficulty-desc-text');
        if (descEl) {
            descEl.innerText = this.getVillainConfig().desc;
        }
        this.updateRivalHud();
    },

    updateRivalHud() {
        const badge = document.getElementById('hud-rival-badge');
        if (!badge) return;
        const cfg = this.getVillainConfig();
        const leading = !this.villain || this.player.x >= this.villain.x;
        badge.innerText = `${leading ? '1ST' : '2ND'} • ${cfg.shortLabel}`;
        badge.className = `hud-rival-badge ${leading ? 'leading' : 'trailing'}`;
    },

    showScreen(id) {
        document.querySelectorAll('.menu-screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        this.gameState = id === 'game-screen' ? 'playing' : (id.includes('character') ? 'character_select' : 'menu');
        
        // Deactivate all overlays when changing screens so they don't block clicks
        document.querySelectorAll('.overlay-panel').forEach(o => o.classList.remove('active'));

        // Synchronize active cards on character select screen
        if (id === 'character-select-screen') {
            document.querySelectorAll('.char-card').forEach(c => {
                if (c.dataset.character === this.selectedVehicle) {
                    c.classList.add('active');
                } else {
                    c.classList.remove('active');
                }
            });
        }
        
        if (id !== 'game-screen') {
            AudioEngine.startMusic('main');
        }
    },

    updateMenuCanvases() {
        const mc = document.getElementById('menu-char-canvas');
        if (mc) {
            const ctx = mc.getContext('2d');
            ctx.clearRect(0, 0, mc.width, mc.height);
            const time = Date.now() * 0.005;
            if (this.selectedVehicle === 'jeep') Assets.drawJeep(ctx, 40, 40, 80, 50, time);
            else if (this.selectedVehicle === 'speeder') Assets.drawSpeeder(ctx, 40, 40, 80, 50, time);
            else Assets.drawTank(ctx, 40, 40, 80, 50, time);
        }

        ['jeep', 'speeder', 'tank'].forEach(v => {
            const c = document.getElementById(`char-${v}-canvas`);
            if (c) {
                const ctx = c.getContext('2d');
                ctx.clearRect(0, 0, c.width, c.height);
                const time = Date.now() * 0.005;
                if (v === 'jeep') Assets.drawJeep(ctx, 30, 30, 80, 50, time);
                else if (v === 'speeder') Assets.drawSpeeder(ctx, 30, 30, 80, 50, time);
                else Assets.drawTank(ctx, 30, 30, 80, 50, time);
            }
        });
    },

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pause-overlay').classList.add('active');
            AudioEngine.stopMusic();
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pause-overlay').classList.remove('active');
            AudioEngine.startMusic();
        }
    },

    startLevel(index, keepScore = false) {
        if (!keepScore) {
            this.score = this.levelStartScore || 0;
        }
        this.levelIndex = index;
        this.showScreen('game-screen');
        document.getElementById('hud-level-val').innerText = index;
        document.getElementById('gameover-overlay').classList.remove('active');
        document.getElementById('victory-overlay').classList.remove('active');
        
        // Update parallax background based on level
        const floor = document.querySelector('.jungle-floor, .ocean-floor, .volcano-floor');
        if (floor) {
            if (index === 1) {
                floor.className = 'ocean-floor';
            } else if (index === 2) {
                floor.className = 'jungle-floor';
            } else {
                floor.className = 'volcano-floor';
            }
        }
        const themeKey = 'level' + index;
        AudioEngine.startMusic(AudioEngine.themes[themeKey] ? themeKey : 'main');
        this.loadLevelData(this.levels[index]);
    },

    loadLevelData(mapData) {
        this.levelBlocks = [];
        this.swampGaps = [];
        this.ramps = [];
        this.elevators = [];
        this.qblocks = [];
        this.hazards = [];
        this.boss = null;
        this.bossDefeated = false;
        this.bossSpawnX = 0;
        this.bossSpawnY = 0;
        this.minions = [];
        this.bossPineapples = [];
        this.coconutBombs = [];
        this.pineappleBubbles = [];
        this.collectibles = [];
        this.volcanoVents = [];
        this.birdCage = null;
        this.tikiSpikes = [];
        this.tikiTotems = [];
        this.tikiFireJets = [];
        this.villain = null;
        this.villainBombs = [];
        this.villainTraps = [];
        this.villainWarningPlayed = false;
        this.particles = [];
        this.scrollX = 0;
        this.cameraTargetX = 0;
        this.levelWidth = mapData[0].length * this.cellSize;
        
        this.bgBirds = [];
        this.keys = {};
        for (let i = 0; i < 20; i++) {
            const size = Math.random() * 0.2 + 0.15; // Smaller birds: size 0.15 to 0.35
            this.bgBirds.push({
                x: Math.random() * 2000 - 500,
                y: Math.random() * 220 + 30, // Positioned higher up in the sky
                vx: (Math.random() * 0.8 + 0.3) * (size / 0.35) * (Math.random() > 0.5 ? 1 : -1),
                size: size,
                flapOffset: Math.random() * Math.PI * 2,
                flapSpeed: (Math.random() * 0.1 + 0.05) * (size * 2)
            });
        }
        
        // Reset Player
        this.lives = 3;
        if (document.getElementById('hud-lives-val')) {
            document.getElementById('hud-lives-val').innerText = this.lives;
        }
        if (document.getElementById('hud-score-val')) {
            document.getElementById('hud-score-val').innerText = String(this.score).padStart(5, '0');
        }
        const birdHud = document.getElementById('hud-bird-container');
        if (birdHud) {
            birdHud.style.display = 'none';
        }

        this.player.vx = 0;
        this.player.vy = 0;
        this.player.jumpGraceTimer = 0;
        this.player.jumpsRemaining = this.player.maxJumps;
        this.player.isFlying = false;
        this.player.flyTimer = 0;
        this.player.dead = false;
        this.player.isInvincible = false;
        this.player.invincibilityTimer = 0;
        this.player.lastSafeX = 160;
        this.player.lastSafeY = 360;
        this.player.specialReady = true;
        this.player.specialActive = false;
        this.player.specialTimer = 0;

        const badge = document.getElementById('hud-special-badge');
        if (badge) {
            badge.innerText = 'READY';
            badge.className = 'hud-special-badge ready';
        }

        // Apply distinct vehicle stats
        if (this.selectedVehicle === 'jeep') {
            this.player.speedCap = 6.8;
            this.player.accel = 0.24;
            this.player.jumpForce = 12.5;
            this.player.projectileDamage = 1;
            this.player.maxProjectiles = 3;
            this.player.specialDuration = 300; // 5.0s
        } else if (this.selectedVehicle === 'speeder') {
            this.player.speedCap = 7.6;
            this.player.accel = 0.28;
            this.player.jumpForce = 13.0;
            this.player.projectileDamage = 1;
            this.player.maxProjectiles = 3;
            this.player.specialDuration = 390; // 6.5s
        } else if (this.selectedVehicle === 'tank') {
            this.player.speedCap = 6.3;
            this.player.accel = 0.21;
            this.player.jumpForce = 12.0;
            this.player.projectileDamage = 2; // 2x damage!
            this.player.maxProjectiles = 4;   // 4 max shots!
            this.player.specialDuration = 300; // 5.0s
        }

        const cs = this.cellSize;
        for (let r = 0; r < mapData.length; r++) {
            for (let c = 0; c < mapData[r].length; c++) {
                const char = mapData[r][c];
                const x = c * cs;
                const y = r * cs;
                
                if (char === '1') {
                    this.player.x = x;
                    this.player.y = y;
                    this.player.lastSafeX = x;
                    this.player.lastSafeY = y;
                } else if (char === 'S') {
                    let hasBlockBelow = (r < mapData.length - 1 && mapData[r+1][c] === 'S');
                    let vineLength = (!hasBlockBelow && Math.random() > 0.5) ? 40 + Math.random() * 80 : 0;
                    this.levelBlocks.push({ x, y, w: cs, h: cs, vineLength });
                } else if (char === '~') {
                    this.swampGaps.push({ x, y, w: cs, h: cs });
                } else if (char === '/') {
                    this.ramps.push({ x, y, w: cs, h: cs, dir: 1 });
                } else if (char === '\\') {
                    this.ramps.push({ x, y, w: cs, h: cs, dir: -1 });
                } else if (char === '^') {
                    this.elevators.push({
                        x, y, 
                        w: cs * 2, h: 20, 
                        startY: y,
                        minY: cs * 5, // Always go up to Row 5 (upper track)
                        vy: -2,
                        pauseTimer: 0
                    });
                } else if (char === '?') {
                    this.qblocks.push({ x, y, w: cs, h: cs, active: true });
                } else if (char === 'B') {
                    this.boss = {
                        x, y: y - cs * 3,
                        w: 220, h: 220,
                        hp: 15, maxHp: 15,
                        state: 'idle', frame: 0,
                        vx: 2, vy: 0,
                        hitTimer: 0,
                        hitInvincible: 0,
                        spearCooldown: 60,
                        minionSpawnCooldown: 60
                    };
                    this.bossSpawnX = x;
                    this.bossSpawnY = r * cs + cs * 3;
                } else if (char === 'm') {
                    this.minions.push({ 
                        x, y: y - 10, 
                        w: 50, h: 50, 
                        hp: 2, maxHp: 2,
                        vx: 1.5, vy: 0, 
                        isBossMinion: true, 
                        hitTimer: 0,
                        frame: Math.floor(Math.random()*100) 
                    });
                } else if (char === 'M') {
                    const isBoss = Math.random() < 0.25;
                    if (isBoss) {
                        this.minions.push({ 
                            x, y: y - 10, 
                            w: 50, h: 50, 
                            hp: 2, maxHp: 2,
                            vx: 1.5, vy: 0, 
                            isBossMinion: true, 
                            hitTimer: 0,
                            frame: Math.floor(Math.random()*100) 
                        });
                    } else {
                        this.minions.push({
                            x, y: y,
                            w: cs, h: cs,
                            hp: 1, maxHp: 1,
                            vx: 1.5, vy: 0,
                            startX: x,
                            hitTimer: 0,
                            frame: Math.floor(Math.random()*100)
                        });
                    }
                } else if (char === 'E') {
                    this.goal = { x, y, w: cs, h: cs };
                } else if (char === '*') {
                    this.tikiSpikes.push({ x, y, w: cs, h: cs });
                    if (r === mapData.length - 2) {
                        this.levelBlocks.push({ x, y: y + cs, w: cs, h: cs, vineLength: 0 });
                    }
                } else if (char === '#') {
                    this.tikiTotems.push({ x, y, w: cs, h: cs, hp: 2, maxHp: 2 });
                    if (r === mapData.length - 2) {
                        this.levelBlocks.push({ x, y: y + cs, w: cs, h: cs, vineLength: 0 });
                    }
                } else if (char === 'T') {
                    this.tikiFireJets.push({ x, y, w: cs, h: cs, frameCycle: Math.floor(Math.random() * 180) });
                    if (r === mapData.length - 2) {
                        this.levelBlocks.push({ x, y: y + cs, w: cs, h: cs, vineLength: 0 });
                    }
                } else if (char === 'P') {
                    this.collectibles.push({ x, y, w: cs, h: cs, type: 'pineapple' });
                } else if (char === 'C') {
                    this.collectibles.push({ x, y, w: cs, h: cs, type: 'coconut' });
                } else if (char === 'V') {
                    this.volcanoVents.push({ x, y, w: cs, h: cs, activeTimer: 0 });
                    if (r === mapData.length - 1) {
                        this.swampGaps.push({ x, y, w: cs, h: cs });
                    }
                }
            }
        }

        // Spawn Villain Competitor on every stage right alongside the starting grid
        const vCfg = this.getVillainConfig();
        this.villain = {
            x: this.player.x + 85,
            y: this.player.y - 4,
            w: 70,
            h: 44,
            vx: vCfg.baseSpeed,
            vy: 0,
            wheelRot: 0,
            frame: 0,
            isHovering: false,
            stunTimer: 0,
            stunImmunity: 0,
            dropCooldown: vCfg.dropMinCd,
            dropFlash: 0,
            finished: false
        };
        this.updateRivalHud();
    },

    shootCoconutBomb() {
        if (this.coconutBombs.length < this.player.maxProjectiles) {
            this.coconutBombs.push({
                x: this.player.x + this.player.w,
                y: this.player.y + this.player.h/2,
                vx: Math.max(this.player.vx, 0) + 15,
                vy: -3,
                r: this.player.projectileDamage > 1 ? 13 : 10,
                damage: this.player.projectileDamage
            });
            AudioEngine.playSFX('shoot');
        }
    },

    shootPineappleBubble() {
        if (this.pineappleBubbles.length < this.player.maxProjectiles) {
            this.pineappleBubbles.push({
                x: this.player.x + this.player.w,
                y: this.player.y + this.player.h/2,
                vx: Math.max(this.player.vx, 0) + 12,
                vy: -6,
                r: this.player.projectileDamage > 1 ? 13 : 10,
                damage: this.player.projectileDamage,
                frame: 0
            });
            AudioEngine.playSFX('shoot');
        }
    },

    deploySpecialRescue() {
        if (!this.player.dead && this.player.specialReady && !this.player.specialActive) {
            this.player.specialReady = false;
            this.player.specialActive = true;
            this.player.specialTimer = this.player.specialDuration || 300;
            this.player.isInvincible = true;
            this.player.invincibilityTimer = this.player.specialTimer;
            AudioEngine.playSFX('deploy');
            
            // Add flashy bubble particles!
            for (let p = 0; p < 25; p++) {
                this.particles.push({
                    x: this.player.x + this.player.w/2,
                    y: this.player.y + this.player.h,
                    vx: (Math.random() - 0.5) * 8,
                    vy: -2 - Math.random() * 6,
                    life: 40,
                    color: '#00cec9'
                });
            }

            const badge = document.getElementById('hud-special-badge');
            if (badge) {
                const secs = (this.player.specialTimer / 60).toFixed(1);
                badge.innerText = `ACTIVE (${secs}s)`;
                badge.className = 'hud-special-badge active';
            }
        }
    },

    playerDie() {
        if (this.player.specialActive) return;
        if (this.player.isInvincible || this.player.dead) return;
        
        // Auto-rescue trigger!
        if (this.player.specialReady) {
            this.deploySpecialRescue();
            if (this.player.y > 420) {
                this.player.y = 350;
                this.player.vy = -8;
                this.player.vx = Math.max(this.player.vx, 4);
            }
            return;
        }
        
        if (this.lives > 1) {
            this.lives--;
            if (document.getElementById('hud-lives-val')) {
                document.getElementById('hud-lives-val').innerText = this.lives;
            }
            AudioEngine.playSFX('wreck');
            
            for(let p=0;p<30;p++) {
                this.particles.push({
                    x: this.player.x + this.player.w/2, 
                    y: this.player.y > 600 ? 520 : this.player.y, 
                    vx: (Math.random()-0.5)*10, 
                    vy: (Math.random()-1)*10, 
                    life: 30, 
                    color: '#00b4ff'
                });
            }
            
            this.player.isFlying = false;
            this.player.flyTimer = 0;
            const birdHud = document.getElementById('hud-bird-container');
            if (birdHud) birdHud.style.display = 'none';

            this.player.x = this.player.lastSafeX !== null ? this.player.lastSafeX : 160;
            this.player.y = (this.player.lastSafeY !== null ? this.player.lastSafeY : 360) - 80;
            this.player.vx = 0;
            this.player.vy = 0;
            this.player.jumpsRemaining = this.player.maxJumps;
            this.player.isInvincible = true;
            this.player.invincibilityTimer = 120;
            this.player.dead = false;
            this.cameraTargetX = Math.max(0, this.player.x - 300);
            this.scrollX = this.cameraTargetX;

            // Clear any villain bombs/traps right next to respawn point so player isn't spawn-trapped
            this.villainBombs = this.villainBombs.filter(vb => Math.abs(vb.x - this.player.x) > 160);
            this.villainTraps = this.villainTraps.filter(vt => Math.abs((vt.x + vt.w / 2) - this.player.x) > 160);

            // If boss was already defeated and player died during Lei Flight, respawn the bird cage if back near boss arena
            if (this.bossDefeated && !this.birdCage && this.player.x <= this.bossSpawnX + 300) {
                this.birdCage = { x: this.bossSpawnX, y: 280, w: 80, h: 100 };
            }
        } else {
            this.player.dead = true;
            this.player.isFlying = false;
            this.player.flyTimer = 0;
            const birdHud = document.getElementById('hud-bird-container');
            if (birdHud) birdHud.style.display = 'none';

            this.lives--;
            if (document.getElementById('hud-lives-val')) {
                document.getElementById('hud-lives-val').innerText = this.lives;
            }
            AudioEngine.stopMusic();
            AudioEngine.playSFX('wreck');
            
            this.gameState = 'gameover';
            const goOverlay = document.getElementById('gameover-overlay');
            const goH2 = goOverlay.querySelector('h2');
            const goP = goOverlay.querySelector('p');
            if (goH2) goH2.innerText = 'WRECKED!';
            if (goP) goP.innerText = 'Your vehicle fell into the hazard or was destroyed.';
            goOverlay.classList.add('active');
        }
    },

    update() {
        if (this.gameState !== 'playing') return;
        this.globalFrame++;
        
        if (this.player.invincibilityTimer > 0) {
            this.player.invincibilityTimer--;
            if (this.player.invincibilityTimer <= 0) this.player.isInvincible = false;
        }
        if (this.player.jumpGraceTimer > 0) {
            this.player.jumpGraceTimer--;
        }

        if (this.player.specialActive) {
            this.player.specialTimer--;
            
            // Sync HUD timer
            const badge = document.getElementById('hud-special-badge');
            if (badge) {
                let secondsLeft = (this.player.specialTimer / 60).toFixed(1);
                badge.innerText = `ACTIVE (${secondsLeft}s)`;
            }

            if (this.player.specialTimer <= 0) {
                this.player.specialActive = false;
                // Brief 1-second grace invincibility after rescue board ends
                this.player.isInvincible = true;
                this.player.invincibilityTimer = 60;
                const badge = document.getElementById('hud-special-badge');
                if (badge) {
                    badge.innerText = 'USED';
                    badge.className = 'hud-special-badge used';
                }
            }

            // Spawn spray/bubbles trail particles
            if (Math.random() < 0.45) {
                let color = '#ffffff'; // default water/bubbles spray
                if (this.levelIndex === 3) {
                    color = Math.random() > 0.5 ? '#ff7675' : '#fdcb6e'; // lava colors
                } else if (this.levelIndex === 2) {
                    color = '#55efc4'; // jungle swamp colors
                }
                this.particles.push({
                    x: this.player.x + Math.random() * this.player.w,
                    y: this.player.y + this.player.h,
                    vx: -this.player.vx * 0.4 + (Math.random() - 0.5) * 3,
                    vy: -1 - Math.random() * 3,
                    life: 20 + Math.random() * 15,
                    color: color
                });
            }
        }

        // Responsive Jump input while grounded
        if ((this.keys['Space'] || this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) && this.player.isGrounded && !this.player.isFlying) {
            this.triggerJump();
        }

        // Boost and Movement Input
        let targetSpeed = 0;
        this.player.isBoosting = false;
        
        if (this.keys['d'] || this.keys['D'] || this.keys['ArrowRight']) {
            targetSpeed = this.player.speedCap;
            if (this.keys['Shift']) {
                targetSpeed *= 1.5;
                this.player.isBoosting = true;
            }
        } else if (this.keys['a'] || this.keys['A'] || this.keys['ArrowLeft']) {
            targetSpeed = -this.player.speedCap;
            if (this.keys['Shift']) {
                targetSpeed *= 1.5;
                this.player.isBoosting = true;
            }
        }

        // Apply acceleration
        if (targetSpeed !== 0) {
            this.player.vx += (targetSpeed - this.player.vx) * this.player.accel;
        } else {
            this.player.vx += (0 - this.player.vx) * 0.1;
        }
        
        // Friction
        if (targetSpeed === 0 && this.player.isGrounded) this.player.vx *= this.player.friction;

        // Apply bird flight
        if (this.player.isFlying) {
            this.player.flyTimer -= 1/60;
            
            // Allow vertical control
            let targetVy = 0;
            if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'] || this.keys['Space']) {
                targetVy = -this.player.speedCap * 0.8; // Fly up
            } else if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
                targetVy = this.player.speedCap * 0.8;  // Fly down
            }
            
            // Smooth vertical acceleration
            let verticalAccel = this.player.accel;
            if (targetVy !== 0) {
                this.player.vy += (targetVy - this.player.vy) * verticalAccel;
            } else {
                // Hovering decay
                this.player.vy += (0 - this.player.vy) * 0.1;
            }
            
            document.getElementById('hud-bird-container').style.display = 'flex';
            document.getElementById('hud-bird-val').innerText = Math.max(0, this.player.flyTimer).toFixed(1);
            if (this.player.flyTimer <= 0) {
                this.player.isFlying = false;
                document.getElementById('hud-bird-container').style.display = 'none';
            }
        } else {
            // Gravity
            this.player.vy += 0.6; 
        }

        // Move X
        this.player.x += this.player.vx;
        this.player.wheelRot += this.player.vx * 0.1;

        // Collision X (simplified bounds, no backwards)
        if (this.player.x < 0) { this.player.x = 0; this.player.vx = 0; }
        if (this.levelWidth && this.player.x + this.player.w > this.levelWidth) {
            this.player.x = this.levelWidth - this.player.w;
            this.player.vx = 0;
        }

        // Tiki Totem Horizontal Blocking
        for (let t of this.tikiTotems) {
            if (this.player.x + this.player.w > t.x && this.player.x < t.x + t.w &&
                this.player.y + this.player.h > t.y + 5 && this.player.y < t.y + t.h - 5) {
                if (this.player.vx > 0) {
                    this.player.x = t.x - this.player.w;
                    this.player.vx = 0;
                } else if (this.player.vx < 0) {
                    this.player.x = t.x + t.w;
                    this.player.vx = 0;
                }
            }
        }

        // Move Y
        this.player.y += this.player.vy;
        if (this.player.y < 0) {
            this.player.y = 0;
            this.player.vy = 0;
        }
        this.player.isGrounded = false;

        // Elevators update
        for (let e of this.elevators) {
            if (e.pauseTimer > 0) {
                e.pauseTimer--;
                continue;
            }
            e.y += e.vy;
            if (e.y <= e.minY) {
                e.y = e.minY;
                e.vy = 2;
                e.pauseTimer = 60; // 1s pause
            } else if (e.y >= e.startY) {
                e.y = e.startY;
                e.vy = -2;
                e.pauseTimer = 60; // 1s pause
            }
        }

        // Continuous Ground Collision
        let groundY = Infinity;
        let isOnRamp = false;
        let isOnElevator = false;
        let isOnSwamp = false;
        let isOnTotem = false;
        let elevatorVy = 0;
        let rampDir = 0;
        let playerCenterX = this.player.x + this.player.w / 2;

        // Check blocks
        for (let b of this.levelBlocks) {
            if (this.player.x + this.player.w > b.x && this.player.x < b.x + b.w) {
                if (b.y < groundY) {
                    let prevBottom = this.player.y + this.player.h - this.player.vy;
                    // Snap to platform if we are somewhat above or near the top
                    if (prevBottom <= b.y + 30) {
                        groundY = b.y;
                        isOnSwamp = false;
                        isOnTotem = false;
                    }
                }
            }
        }

        // Check swamp/water/lava gaps if rescue board/boat mode is active
        if (this.player.specialActive) {
            for (let w of this.swampGaps) {
                if (this.player.x + this.player.w > w.x && this.player.x < w.x + w.w) {
                    if (w.y < groundY) {
                        let prevBottom = this.player.y + this.player.h - this.player.vy;
                        // Snap to water surface
                        if (prevBottom <= w.y + 30) {
                            groundY = w.y;
                            isOnSwamp = true;
                            isOnTotem = false;
                        }
                    }
                }
            }
        }

        // Check Tiki Totems (can stand on top)
        for (let t of this.tikiTotems) {
            if (this.player.x + this.player.w > t.x && this.player.x < t.x + t.w) {
                if (t.y < groundY) {
                    let prevBottom = this.player.y + this.player.h - this.player.vy;
                    if (prevBottom <= t.y + 30) {
                        groundY = t.y;
                        isOnTotem = true;
                        isOnSwamp = false;
                    }
                }
            }
        }

        // Check elevators
        for (let e of this.elevators) {
            if (this.player.x + this.player.w > e.x && this.player.x < e.x + e.w) {
                if (e.y < groundY) {
                    let prevBottom = this.player.y + this.player.h - this.player.vy;
                    if (prevBottom <= e.y - e.vy + 30) {
                        groundY = e.y;
                        isOnElevator = true;
                        isOnSwamp = false;
                        isOnTotem = false;
                        elevatorVy = e.vy;
                    }
                }
            }
        }

        // Check ramps
        for (let r of this.ramps) {
            if (this.player.x + this.player.w > r.x && this.player.x < r.x + r.w) {
                let prevBottom = this.player.y + this.player.h - this.player.vy;
                
                let relativeX = playerCenterX - r.x;
                if (relativeX < 0) relativeX = 0;
                if (relativeX > r.w) relativeX = r.w;
                
                let rampHeightAtX = r.dir === 1 
                    ? r.y + r.h - (relativeX / r.w) * r.h 
                    : r.y + (relativeX / r.w) * r.h;
                
                if (rampHeightAtX < groundY && prevBottom <= r.y + r.h + 30) {
                    groundY = rampHeightAtX;
                    isOnRamp = true;
                    rampDir = r.dir;
                    isOnElevator = false;
                    isOnSwamp = false;
                    isOnTotem = false;
                }
            }
        }

        // Apply Grounding (unless in jump grace period)
        if (this.player.jumpGraceTimer === 0 && this.player.y + this.player.h >= groundY) {
            this.player.y = groundY - this.player.h;
            
            if (isOnElevator) {
                this.player.vy = elevatorVy;
            } else if (isOnRamp) {
                if (rampDir === 1 && this.player.vx > 0) {
                    this.player.vy = -this.player.vx;
                } else if (rampDir === -1 && this.player.vx < 0) {
                    this.player.vy = this.player.vx;
                } else {
                    this.player.vy = 0;
                }
            } else {
                this.player.vy = 0;
            }
            this.player.isGrounded = true;
            this.player.jumpsRemaining = this.player.maxJumps;

            // Only save lastSafeX/Y if grounded on a solid wood platform free of nearby hazards
            if (!isOnSwamp && !isOnElevator && !isOnRamp && !isOnTotem) {
                let nearHazard = false;
                for (let s of this.tikiSpikes) {
                    if (this.player.x + this.player.w + 15 > s.x && this.player.x - 15 < s.x + s.w &&
                        Math.abs((this.player.y + this.player.h) - (s.y + s.h)) < 20) {
                        nearHazard = true;
                        break;
                    }
                }
                if (!nearHazard) {
                    for (let f of this.tikiFireJets) {
                        if (this.player.x + this.player.w + 15 > f.x && this.player.x - 15 < f.x + f.w &&
                            Math.abs((this.player.y + this.player.h) - (f.y + f.h)) < 20) {
                            nearHazard = true;
                            break;
                        }
                    }
                }
                if (!nearHazard) {
                    this.player.lastSafeX = this.player.x;
                    this.player.lastSafeY = this.player.y;
                }
            }
        }

        // Camera follow
        this.cameraTargetX = this.player.x - 300;
        if (this.cameraTargetX < 0) this.cameraTargetX = 0;
        this.scrollX += (this.cameraTargetX - this.scrollX) * 0.1;

        // Update hazards
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            let h = this.hazards[i];
            h.vy += 0.15; // gravity
            h.y += h.vy;
            h.frame++;
            if (h.y > 800) {
                this.hazards.splice(i, 1);
                continue;
            }
            // Collision with player
            if (this.player.x + this.player.w > h.x - h.r && this.player.x < h.x + h.r &&
                this.player.y + this.player.h > h.y - h.r && this.player.y < h.y + h.r) {
                this.playerDie();
                this.hazards.splice(i, 1);
            }
        }

        // Player vs QBlocks (hit from below)
        for (let q of this.qblocks) {
            if (q.active && this.player.vy < 0) {
                if (this.player.x + this.player.w > q.x && this.player.x < q.x + q.w) {
                    let prevTop = this.player.y - this.player.vy;
                    if (prevTop >= q.y + q.h && this.player.y <= q.y + q.h) {
                        this.player.y = q.y + q.h;
                        this.player.vy = 0;
                        q.active = false;
                        this.score += 1000;
                        AudioEngine.playSFX('birdUnlock');
                        for(let p=0;p<20;p++) {
                            this.particles.push({x: q.x + q.w/2, y: q.y, vx: (Math.random()-0.5)*10, vy: -5 - Math.random()*5, life: 30, color: '#f1c40f'});
                        }
                    }
                }
            }
        }

        // Background Birds
        for (let b of this.bgBirds) {
            b.x += b.vx;
            b.flapOffset += b.flapSpeed;
            // Wrap relative to parallax scroll
            const parallaxX = this.scrollX * 0.2;
            if (b.x > parallaxX + 1200) b.x = parallaxX - 200;
            if (b.x < parallaxX - 200) b.x = parallaxX + 1200;

            // Birds poop hazards
            if (b.size > 0.2 && Math.random() < 0.00025) {
                let worldX = b.x + this.scrollX * 0.8;
                let poopScale = b.size * 2.5;
                this.hazards.push({
                    x: worldX,
                    y: b.y,
                    vy: 0,
                    r: Math.max(4.5, (8 + Math.random() * 6) * poopScale),
                    frame: 0
                });
            }
        }

        // Coconut Bombs
        for (let i = this.coconutBombs.length - 1; i >= 0; i--) {
            let cb = this.coconutBombs[i];
            const dmg = cb.damage || 1;
            cb.x += cb.vx;
            cb.y += cb.vy;
            cb.vy += 0.2; // gravity
            if (cb.y > 600 || cb.x > this.scrollX + 1100) {
                this.coconutBombs.splice(i, 1);
                continue;
            }
            
            let hit = false;
            // Boss collision
            if (this.boss && this.boss.hp > 0 && 
                cb.x > this.boss.x - this.boss.w/2 && cb.x < this.boss.x + this.boss.w/2 &&
                cb.y > this.boss.y - this.boss.h/2 && cb.y < this.boss.y + this.boss.h/2) {
                
                this.boss.hp -= dmg;
                this.boss.hitTimer = 10;
                hit = true;
                this.score += 500;
                AudioEngine.playSFX('bossHit');
                
                if (this.boss.hp <= 0) {
                    const bx = this.boss.x;
                    const by = this.boss.y;
                    this.birdCage = { x: bx, y: by + 20, w: 80, h: 100 };
                    this.bossDefeated = true;
                    this.boss = null;
                    AudioEngine.playSFX('birdUnlock');
                    for (let p = 0; p < 30; p++) {
                        this.particles.push({ x: bx, y: by, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 40, color: '#ffd700' });
                    }
                }
            }

            // Totem collision
            if (!hit) {
                for (let tIdx = this.tikiTotems.length - 1; tIdx >= 0; tIdx--) {
                    let t = this.tikiTotems[tIdx];
                    if (cb.x > t.x && cb.x < t.x + t.w && cb.y > t.y && cb.y < t.y + t.h) {
                        t.hp -= dmg;
                        hit = true;
                        AudioEngine.playSFX('hit');
                        for (let p = 0; p < 8; p++) {
                            this.particles.push({
                                x: t.x + t.w/2,
                                y: t.y + t.h/2,
                                vx: (Math.random() - 0.5) * 6,
                                vy: (Math.random() - 0.5) * 6 - 2,
                                life: 20,
                                color: '#d35400'
                            });
                        }
                        if (t.hp <= 0) {
                            this.tikiTotems.splice(tIdx, 1);
                            this.score += 300;
                            for (let p = 0; p < 20; p++) {
                                this.particles.push({
                                    x: t.x + t.w/2,
                                    y: t.y + t.h/2,
                                    vx: (Math.random() - 0.5) * 10,
                                    vy: (Math.random() - 0.5) * 10 - 3,
                                    life: 30,
                                    color: '#8b5a2b'
                                });
                            }
                        }
                        break;
                    }
                }
            }

            // QBlock collision
            if (!hit) {
                for (let q of this.qblocks) {
                    if (q.active && cb.x > q.x && cb.x < q.x + q.w && cb.y > q.y && cb.y < q.y + q.h) {
                        q.active = false;
                        hit = true;
                        this.score += 1000;
                        AudioEngine.playSFX('birdUnlock');
                        for(let p=0;p<20;p++) {
                            this.particles.push({x: q.x + q.w/2, y: q.y, vx: (Math.random()-0.5)*10, vy: -5 - Math.random()*5, life: 30, color: '#f1c40f'});
                        }
                        break;
                    }
                }
            }

            // Minion collision
            if (!hit) {
                for (let m = this.minions.length - 1; m >= 0; m--) {
                    let minion = this.minions[m];
                    if (cb.x > minion.x && cb.x < minion.x + minion.w &&
                        cb.y > minion.y && cb.y < minion.y + minion.h) {
                        minion.hp = (minion.hp || 1) - dmg;
                        minion.hitTimer = 10;
                        hit = true;
                        for (let p = 0; p < 8; p++) {
                            this.particles.push({ x: minion.x + minion.w/2, y: minion.y + minion.h/2, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, life: 20, color: '#ff5252' });
                        }
                        if (minion.hp <= 0) {
                            this.minions.splice(m, 1);
                            this.score += minion.isVillainMinion ? 150 : (minion.isBossMinion ? 250 : 100);
                            AudioEngine.playSFX('bossHit');
                        } else {
                            AudioEngine.playSFX('hit');
                        }
                        break;
                    }
                }
            }
            if (!hit && this.checkProjectileVsVillainEntities(cb)) {
                hit = true;
            }
            if (hit) this.coconutBombs.splice(i, 1);
        }

        // Pineapple Bubbles
        for (let i = this.pineappleBubbles.length - 1; i >= 0; i--) {
            let pb = this.pineappleBubbles[i];
            const dmg = pb.damage || 1;
            pb.x += pb.vx;
            pb.y += pb.vy;
            pb.vy += 0.15; // floatier gravity
            pb.frame++;
            if (pb.y > 600 || pb.x > this.scrollX + 1100) {
                this.pineappleBubbles.splice(i, 1);
                continue;
            }
            
            let hit = false;
            if (this.boss && this.boss.hp > 0 && 
                pb.x > this.boss.x - this.boss.w/2 && pb.x < this.boss.x + this.boss.w/2 &&
                pb.y > this.boss.y - this.boss.h/2 && pb.y < this.boss.y + this.boss.h/2) {
                
                this.boss.hp -= dmg;
                this.boss.hitTimer = 10;
                hit = true;
                this.score += 500;
                AudioEngine.playSFX('bossHit');
                
                if (this.boss.hp <= 0) {
                    const bx = this.boss.x;
                    const by = this.boss.y;
                    this.birdCage = { x: bx, y: by + 20, w: 80, h: 100 };
                    this.bossDefeated = true;
                    this.boss = null;
                    AudioEngine.playSFX('birdUnlock');
                    for (let p = 0; p < 30; p++) {
                        this.particles.push({ x: bx, y: by, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 40, color: '#ffd700' });
                    }
                }
            }

            // Totem collision
            if (!hit) {
                for (let tIdx = this.tikiTotems.length - 1; tIdx >= 0; tIdx--) {
                    let t = this.tikiTotems[tIdx];
                    if (pb.x > t.x && pb.x < t.x + t.w && pb.y > t.y && pb.y < t.y + t.h) {
                        t.hp -= dmg;
                        hit = true;
                        AudioEngine.playSFX('hit');
                        for (let p = 0; p < 8; p++) {
                            this.particles.push({
                                x: t.x + t.w/2,
                                y: t.y + t.h/2,
                                vx: (Math.random() - 0.5) * 6,
                                vy: (Math.random() - 0.5) * 6 - 2,
                                life: 20,
                                color: '#d35400'
                            });
                        }
                        if (t.hp <= 0) {
                            this.tikiTotems.splice(tIdx, 1);
                            this.score += 300;
                            for (let p = 0; p < 20; p++) {
                                this.particles.push({
                                    x: t.x + t.w/2,
                                    y: t.y + t.h/2,
                                    vx: (Math.random() - 0.5) * 10,
                                    vy: (Math.random() - 0.5) * 10 - 3,
                                    life: 30,
                                    color: '#8b5a2b'
                                });
                            }
                        }
                        break;
                    }
                }
            }

            // QBlock collision
            if (!hit) {
                for (let q of this.qblocks) {
                    if (q.active && pb.x > q.x && pb.x < q.x + q.w && pb.y > q.y && pb.y < q.y + q.h) {
                        q.active = false;
                        hit = true;
                        this.score += 1000;
                        AudioEngine.playSFX('birdUnlock');
                        for(let p=0;p<20;p++) {
                            this.particles.push({x: q.x + q.w/2, y: q.y, vx: (Math.random()-0.5)*10, vy: -5 - Math.random()*5, life: 30, color: '#f1c40f'});
                        }
                        break;
                    }
                }
            }

            if (!hit) {
                for (let m = this.minions.length - 1; m >= 0; m--) {
                    let minion = this.minions[m];
                    if (pb.x > minion.x && pb.x < minion.x + minion.w &&
                        pb.y > minion.y && pb.y < minion.y + minion.h) {
                        minion.hp = (minion.hp || 1) - dmg;
                        minion.hitTimer = 10;
                        hit = true;
                        for (let p = 0; p < 8; p++) {
                            this.particles.push({ x: minion.x + minion.w/2, y: minion.y + minion.h/2, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, life: 20, color: '#ff5252' });
                        }
                        if (minion.hp <= 0) {
                            this.minions.splice(m, 1);
                            this.score += minion.isVillainMinion ? 150 : (minion.isBossMinion ? 250 : 100);
                            AudioEngine.playSFX('bossHit');
                        } else {
                            AudioEngine.playSFX('hit');
                        }
                        break;
                    }
                }
            }
            if (!hit && this.checkProjectileVsVillainEntities(pb)) {
                hit = true;
            }
            if (hit) this.pineappleBubbles.splice(i, 1);
        }

        // Collectibles Collision
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            let col = this.collectibles[i];
            if (this.player.x + this.player.w > col.x && this.player.x < col.x + col.w &&
                this.player.y + this.player.h > col.y && this.player.y < col.y + col.h) {
                
                this.collectibles.splice(i, 1);
                AudioEngine.playSFX('collect');
                
                let pts = col.type === 'pineapple' ? 200 : 100;
                this.score += pts;
                
                let pColor = col.type === 'pineapple' ? '#fdcb6e' : '#8b5a2b';
                for (let p = 0; p < 15; p++) {
                    this.particles.push({
                        x: col.x + col.w/2,
                        y: col.y + col.h/2,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 20,
                        color: pColor
                    });
                }
            }
        }

        // Volcano Vents Collision
        for (let v of this.volcanoVents) {
            if (v.activeTimer > 0) v.activeTimer--;
            
            // Trigger when player overlaps or lands on the vent
            if (this.player.vy >= -2 &&
                this.player.x + this.player.w > v.x + 4 && this.player.x < v.x + v.w - 4 &&
                this.player.y + this.player.h >= v.y && this.player.y <= v.y + v.h) {
                
                if (v.activeTimer === 0) {
                    this.player.vy = -16;
                    this.player.isGrounded = false;
                    this.player.jumpsRemaining = 1;
                    this.player.jumpGraceTimer = 6;
                    v.activeTimer = 35;
                    AudioEngine.playSFX('jump');
                    
                    for (let p = 0; p < 15; p++) {
                        this.particles.push({
                            x: v.x + v.w/2,
                            y: v.y,
                            vx: (Math.random() - 0.5) * 6,
                            vy: -4 - Math.random() * 8,
                            life: 30,
                            color: Math.random() > 0.5 ? '#e17055' : '#fdcb6e'
                        });
                    }
                }
            }
        }

        // Minions update & Player collision
        for (let m = this.minions.length - 1; m >= 0; m--) {
            let minion = this.minions[m];
            if (minion.hitTimer > 0) minion.hitTimer--;
            
            // Physics
            minion.vy += 0.5; // gravity
            minion.x += minion.vx;
            minion.y += minion.vy;
            
            let onGround = false;
            for (let b of this.levelBlocks) {
                // floor collision
                if (minion.vy >= 0 && 
                    minion.y + minion.h >= b.y && minion.y + minion.h - minion.vy <= b.y + 8 && 
                    minion.x + minion.w > b.x && minion.x < b.x + b.w) {
                    minion.y = b.y - minion.h;
                    minion.vy = 0;
                    onGround = true;
                }
                // side collision
                if (minion.y + minion.h > b.y + 5 && minion.y < b.y + b.h) {
                    if (minion.x + minion.w > b.x && minion.x < b.x + b.w) {
                        if (minion.vx > 0) minion.x = b.x - minion.w;
                        else minion.x = b.x + b.w;
                        minion.vx *= -1;
                    }
                }
            }

            // Turn around at Tiki Totems and Spikes
            for (let t of this.tikiTotems) {
                if (minion.y + minion.h > t.y + 5 && minion.y < t.y + t.h &&
                    minion.x + minion.w > t.x && minion.x < t.x + t.w) {
                    if (minion.vx > 0) minion.x = t.x - minion.w;
                    else minion.x = t.x + t.w;
                    minion.vx *= -1;
                }
            }
            for (let s of this.tikiSpikes) {
                if (minion.y + minion.h > s.y + 5 && minion.y < s.y + s.h &&
                    minion.x + minion.w > s.x && minion.x < s.x + s.w) {
                    if (minion.vx > 0) minion.x = s.x - minion.w;
                    else minion.x = s.x + s.w;
                    minion.vx *= -1;
                }
            }

            // Fall off edge turn around
            if (onGround) {
                let edgeSafe = false;
                let checkX = minion.vx > 0 ? minion.x + minion.w + 5 : minion.x - 5;
                for (let b of this.levelBlocks) {
                    if (checkX >= b.x && checkX <= b.x + b.w && Math.abs(b.y - (minion.y + minion.h)) <= 4) {
                        edgeSafe = true; break;
                    }
                }
                if (!edgeSafe) minion.vx *= -1;
            }

            minion.frame++;
            if (minion.y > 1000) {
                this.minions.splice(m, 1);
                continue;
            }

            // Player collision
            if (this.player.x + this.player.w > minion.x && this.player.x < minion.x + minion.w &&
                this.player.y + this.player.h > minion.y && this.player.y < minion.y + minion.h) {
                
                // Jump on top
                if (this.player.vy > 0 && this.player.y + this.player.h - this.player.vy <= minion.y + 16) {
                    this.player.vy = -10;
                    this.player.jumpsRemaining = 1;
                    this.player.jumpGraceTimer = 4;
                    minion.hp = (minion.hp || 1) - 1;
                    minion.hitTimer = 10;
                    AudioEngine.playSFX('jump');
                    for(let p=0;p<10;p++) {
                        this.particles.push({x: minion.x + minion.w/2, y: minion.y + minion.h/2, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, life: 20, color: '#ff5252'});
                    }
                    if (minion.hp <= 0) {
                        this.minions.splice(m, 1);
                        this.score += minion.isBossMinion ? 250 : 200;
                    }
                } else {
                    // Crash
                    this.playerDie();
                }
            }
        }

        // Boss Pineapples (Lava Fireballs) update
        for (let i = this.bossPineapples.length - 1; i >= 0; i--) {
            let spear = this.bossPineapples[i];
            const r = spear.r || 16;
            
            // Initialize physics properties if not present
            if (spear.vy === undefined) spear.vy = -2;
            if (spear.gravity === undefined) spear.gravity = 0.18;
            if (spear.bouncesRemaining === undefined) spear.bouncesRemaining = 3;

            // Apply gravity
            spear.vy += spear.gravity;
            
            // Update position
            spear.x += spear.vx;
            spear.y += spear.vy;
            
            // Block collisions (bouncing around center spear.x, spear.y with radius r)
            for (let b of this.levelBlocks) {
                // floor collision
                if (spear.vy >= 0 && 
                    spear.y + r >= b.y && spear.y + r - spear.vy <= b.y + 8 && 
                    spear.x + r > b.x && spear.x - r < b.x + b.w) {
                    
                    spear.y = b.y - r;
                    spear.vy = -Math.abs(spear.vy) * 0.75; // bounce with energy loss
                    
                    if (Math.abs(spear.vy) < 2.5) {
                        spear.vy = -2.5;
                    }
                    
                    spear.bouncesRemaining--;
                    AudioEngine.playTone(280, 'triangle', 0.12, 0.05); 
                    
                    for (let p = 0; p < 8; p++) {
                        this.particles.push({
                            x: spear.x,
                            y: spear.y + r,
                            vx: (Math.random() - 0.5) * 4,
                            vy: -Math.random() * 3,
                            life: 20,
                            color: Math.random() > 0.5 ? '#e17055' : '#fdcb6e'
                        });
                    }
                    break;
                }

                // side/wall collision
                if (spear.y + r > b.y + 4 && spear.y - r < b.y + b.h - 4) {
                    if (spear.x + r > b.x && spear.x - r < b.x + b.w) {
                        if (spear.vx > 0) spear.x = b.x - r;
                        else spear.x = b.x + b.w + r;
                        spear.vx *= -1;
                        spear.facingRight = spear.vx > 0;
                        spear.bouncesRemaining--;
                        
                        AudioEngine.playTone(320, 'triangle', 0.1, 0.05);
                        for (let p = 0; p < 5; p++) {
                            this.particles.push({
                                x: spear.x,
                                y: spear.y,
                                vx: (Math.random() - 0.5) * 3,
                                vy: (Math.random() - 0.5) * 3,
                                life: 15,
                                color: '#fdcb6e'
                            });
                        }
                        break;
                    }
                }
            }

            // If out of bounces, explode it
            if (spear.bouncesRemaining <= 0) {
                for (let p = 0; p < 15; p++) {
                    this.particles.push({
                        x: spear.x,
                        y: spear.y,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 25,
                        color: Math.random() > 0.5 ? '#ff7675' : '#fdcb6e'
                    });
                }
                AudioEngine.playSFX('hit');
                this.bossPineapples.splice(i, 1);
                continue;
            }

            // Collision with player (centered radius r)
            if (this.player.x + this.player.w > spear.x - r && this.player.x < spear.x + r &&
                this.player.y + this.player.h > spear.y - r && this.player.y < spear.y + r) {
                this.playerDie();
                this.bossPineapples.splice(i, 1);
                continue;
            }
            
            // Out of bounds or fell in a pit
            if (spear.x < this.scrollX - 100 || spear.x > this.scrollX + 1000 || spear.y > 600) {
                this.bossPineapples.splice(i, 1);
            }
        }

        // Boss update
        if (this.boss) {
            this.boss.frame++;
            if (this.boss.hitTimer > 0) this.boss.hitTimer--;
            if (this.boss.hitInvincible > 0) this.boss.hitInvincible--;
            
            // Physics
            this.boss.vy += 0.5;
            this.boss.x += this.boss.vx;
            this.boss.y += this.boss.vy;
            
            let onGround = false;
            for (let b of this.levelBlocks) {
                // floor collision
                if (this.boss.vy >= 0 && 
                    this.boss.y + this.boss.h/2 >= b.y && this.boss.y + this.boss.h/2 - this.boss.vy <= b.y + 10 && 
                    this.boss.x + this.boss.w/2 > b.x && this.boss.x - this.boss.w/2 < b.x + b.w) {
                    this.boss.y = b.y - this.boss.h/2;
                    this.boss.vy = 0;
                    onGround = true;
                }
                // side collision
                if (this.boss.y + this.boss.h/2 > b.y + 5 && this.boss.y - this.boss.h/2 < b.y + b.h) {
                    if (this.boss.vx > 0 && this.boss.x + this.boss.w/2 > b.x && this.boss.x - this.boss.w/2 < b.x) {
                        this.boss.x = b.x - this.boss.w/2;
                        this.boss.vx *= -1;
                    } else if (this.boss.vx < 0 && this.boss.x - this.boss.w/2 < b.x + b.w && this.boss.x + this.boss.w/2 > b.x + b.w) {
                        this.boss.x = b.x + b.w + this.boss.w/2;
                        this.boss.vx *= -1;
                    }
                }
            }

            // Fall off edge turn around
            if (onGround) {
                let edgeSafe = false;
                let checkX = this.boss.vx > 0 ? this.boss.x + this.boss.w/2 + 5 : this.boss.x - this.boss.w/2 - 5;
                for (let b of this.levelBlocks) {
                    if (checkX >= b.x && checkX <= b.x + b.w && Math.abs(b.y - (this.boss.y + this.boss.h/2)) <= 4) {
                        edgeSafe = true; break;
                    }
                }
                if (!edgeSafe) this.boss.vx *= -1;
            }

            // Boss Throw fireballs / spears (only when near camera view)
            if (Math.abs(this.player.x - this.boss.x) < 900) {
                this.boss.spearCooldown--;
                if (this.boss.spearCooldown <= 0) {
                    this.boss.spearCooldown = 85 + Math.random() * 60;
                    const throwDir = (this.player.x < this.boss.x) ? -1 : 1;
                    this.bossPineapples.push({
                        x: this.boss.x + (throwDir > 0 ? this.boss.w * 0.4 : -this.boss.w * 0.4),
                        y: this.boss.y - 10,
                        vx: throwDir * 4,
                        vy: -3 - Math.random() * 2,
                        gravity: 0.18,
                        bouncesRemaining: 3,
                        r: 16,
                        w: 36,
                        h: 36,
                        facingRight: throwDir > 0
                    });
                    AudioEngine.playSFX('jump');
                }
            }

            // Minions spawning for bosses in Stage 2 & 3 (only when player is nearby)
            if ((this.levelIndex === 2 || this.levelIndex === 3) && Math.abs(this.player.x - this.boss.x) < 750 && Math.random() < 0.004 && this.minions.length < 5) {
                this.minions.push({
                    x: this.boss.x,
                    y: this.boss.y + this.boss.h/4,
                    w: this.cellSize,
                    h: this.cellSize,
                    hp: 1,
                    maxHp: 1,
                    hitTimer: 0,
                    vx: (this.player.x < this.boss.x ? -2 : 2),
                    vy: 0,
                    startX: this.boss.x,
                    frame: 0
                });
            }

            // Player collision with Boss (tightened active hitbox)
            const bossHitW = this.boss.w * 0.7;
            const bossHitH = this.boss.h * 0.85;
            if (this.player.x + this.player.w > this.boss.x - bossHitW/2 && this.player.x < this.boss.x + bossHitW/2 &&
                this.player.y + this.player.h > this.boss.y - bossHitH/2 && this.player.y < this.boss.y + bossHitH/2) {
                
                // Jump on top (always bounce player even if boss is in invincibility frames)
                if (this.player.vy > 0 && this.player.y + this.player.h - this.player.vy <= this.boss.y - bossHitH * 0.2) {
                    this.player.vy = -14;
                    this.player.jumpsRemaining = 1;
                    this.player.jumpGraceTimer = 6;
                    if (this.boss.hitInvincible === 0) {
                        this.boss.hp -= this.player.projectileDamage;
                        this.boss.hitTimer = 10;
                        this.boss.hitInvincible = 40;
                        this.score += 500;
                        AudioEngine.playSFX('bossHit');
                        
                        for(let p=0;p<15;p++) {
                            this.particles.push({x: this.boss.x, y: this.boss.y, vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8, life: 30, color: '#ff3d00'});
                        }

                        if (this.boss.hp <= 0) {
                            const bx = this.boss.x;
                            const by = this.boss.y;
                            this.birdCage = { x: bx, y: by + 20, w: 80, h: 100 };
                            this.bossDefeated = true;
                            this.boss = null;
                            AudioEngine.playSFX('birdUnlock');
                            for(let p=0;p<30;p++) {
                                this.particles.push({x: bx, y: by, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, life: 40, color: '#ffd700'});
                            }
                        }
                    }
                } else if (this.boss.hitInvincible === 0) {
                    // Crash
                    this.playerDie();
                }
            }
        }

        // Bird Cage collection
        if (this.birdCage) {
            if (this.player.x + this.player.w > this.birdCage.x - this.birdCage.w/2 && 
                this.player.x < this.birdCage.x + this.birdCage.w/2 &&
                this.player.y + this.player.h > this.birdCage.y - this.birdCage.h &&
                this.player.y < this.birdCage.y) {
                
                this.player.isFlying = true;
                this.player.flyTimer = 10.0; // 10 seconds of flight!
                this.birdCage = null;
                const birdHud = document.getElementById('hud-bird-container');
                if (birdHud) birdHud.style.display = 'flex';
                const birdVal = document.getElementById('hud-bird-val');
                if (birdVal) birdVal.innerText = this.player.flyTimer.toFixed(1);
                AudioEngine.playSFX('birdUnlock');
                
                // Flight activation particles
                for(let p=0;p<20;p++) {
                    this.particles.push({
                        x: this.player.x + this.player.w/2, 
                        y: this.player.y + this.player.h/2, 
                        vx: (Math.random()-0.5)*6, 
                        vy: (Math.random()-0.5)*6, 
                        life: 30, 
                        color: '#ff7675'
                    });
                }
            }
        }

        // Goal Pipe collision
        if (this.goal) {
            if (this.player.x + this.player.w > this.goal.x && this.player.x < this.goal.x + this.goal.w) {
                const vCfg = this.getVillainConfig();
                const beatVillain = !this.villain || !this.villain.finished;
                if (beatVillain) {
                    this.score += vCfg.winBonus;
                    document.getElementById('hud-score-val').innerText = String(this.score).padStart(5, '0');
                }
                this.gameState = 'victory';
                const victoryOverlay = document.getElementById('victory-overlay');
                const h2 = victoryOverlay.querySelector('h2');
                const p = victoryOverlay.querySelector('p');
                const nextBtn = document.getElementById('btn-next-level');
                if (this.levels[this.levelIndex + 1]) {
                    if (h2) h2.innerText = 'STAGE CLEAR!';
                    if (p) p.innerText = `1st Place! You beat ${vCfg.name} (+${vCfg.winBonus} pts)!`;
                    if (nextBtn) nextBtn.innerText = 'Next Stage';
                } else {
                    if (h2) h2.innerText = 'DERBY CHAMPION!';
                    if (p) p.innerText = `You beat ${vCfg.name} & conquered all 3 Hawaiian Islands!`;
                    if (nextBtn) nextBtn.innerText = 'Stage Select';
                }
                victoryOverlay.classList.add('active');
                AudioEngine.stopMusic();
                AudioEngine.playSFX('birdUnlock');
            }
        }

        // Villain Competitor & Dropped Bombs/Traps Update
        this.updateVillain();
        this.updateVillainDrops();
 
        // Tiki Spikes Collision
        for (let s of this.tikiSpikes) {
            if (this.player.x + this.player.w > s.x + 5 && this.player.x < s.x + s.w - 5 &&
                this.player.y + this.player.h > s.y + 10 && this.player.y < s.y + s.h) {
                this.playerDie();
            }
        }

        // Tiki Fire Jets Update & Collision
        for (let f of this.tikiFireJets) {
            f.frameCycle++;
            let cycle = f.frameCycle % 180;
            
            // If active fire jet
            if (cycle >= 120 && cycle < 180) {
                let fireY = f.y - 120;
                if (this.player.x + this.player.w > f.x && this.player.x < f.x + f.w &&
                    this.player.y + this.player.h > fireY && this.player.y < f.y + f.h) {
                    this.playerDie();
                }
            }
        }

        // Death by falling
        if (this.player.y > 600) {
            this.playerDie();
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // HUD updates
        document.getElementById('hud-score-val').innerText = String(this.score).padStart(5, '0');
        this.updateRivalHud();
    },

    checkProjectileVsVillainEntities(proj) {
        // 1. Hit Villain Racer (stuns and slows him down!)
        if (this.villain && !this.villain.finished &&
            proj.x > this.villain.x && proj.x < this.villain.x + this.villain.w &&
            proj.y > this.villain.y && proj.y < this.villain.y + this.villain.h) {
            this.stunVillain(150);
            return true;
        }

        // 2. Shoot Villain Bomb to detonate it safely from afar
        for (let i = this.villainBombs.length - 1; i >= 0; i--) {
            const vb = this.villainBombs[i];
            const dist = Math.hypot(proj.x - vb.x, proj.y - vb.y);
            if (dist < vb.r + (proj.r || 10) + 4) {
                this.score += 100;
                this.explodeVillainBomb(vb, false);
                this.villainBombs.splice(i, 1);
                return true;
            }
        }

        // 3. Shoot Villain Trap to shatter it
        for (let i = this.villainTraps.length - 1; i >= 0; i--) {
            const vt = this.villainTraps[i];
            if (proj.x > vt.x - 4 && proj.x < vt.x + vt.w + 4 &&
                proj.y > vt.y - 4 && proj.y < vt.y + vt.h + 4) {
                this.score += 100;
                AudioEngine.playSFX('hit');
                for (let p = 0; p < 12; p++) {
                    this.particles.push({
                        x: vt.x + vt.w / 2,
                        y: vt.y + vt.h / 2,
                        vx: (Math.random() - 0.5) * 7,
                        vy: -2 - Math.random() * 5,
                        life: 24,
                        color: p % 2 === 0 ? '#9b59b6' : '#ff5252'
                    });
                }
                this.villainTraps.splice(i, 1);
                return true;
            }
        }

        return false;
    },

    stunVillain(scoreReward = 150) {
        if (!this.villain || this.villain.stunImmunity > 0) return;
        const cfg = this.getVillainConfig();
        this.villain.stunTimer = cfg.stunDuration;
        this.villain.stunImmunity = cfg.stunDuration + 45;
        this.villain.vx = -2.0;
        this.score += scoreReward;
        AudioEngine.playSFX('villainStun');
        for (let p = 0; p < 16; p++) {
            this.particles.push({
                x: this.villain.x + this.villain.w / 2,
                y: this.villain.y + this.villain.h / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: -2 - Math.random() * 6,
                life: 28,
                color: p % 2 === 0 ? '#fdcb6e' : '#9b59b6'
            });
        }
    },

    explodeVillainBomb(vb, canHurtPlayer = true) {
        const blastRadius = 52;
        AudioEngine.playSFX('bombExplode');
        for (let p = 0; p < 22; p++) {
            const ang = (p / 22) * Math.PI * 2 + Math.random() * 0.2;
            const spd = 2.5 + Math.random() * 6;
            this.particles.push({
                x: vb.x,
                y: vb.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - 1.5,
                life: 25 + Math.floor(Math.random() * 12),
                color: p % 3 === 0 ? '#fdcb6e' : (p % 3 === 1 ? '#ff5252' : '#2d3436')
            });
        }

        if (canHurtPlayer && !this.player.dead) {
            const px = this.player.x + this.player.w / 2;
            const py = this.player.y + this.player.h / 2;
            if (Math.hypot(px - vb.x, py - vb.y) <= blastRadius + 18) {
                this.playerDie();
            }
        }
    },

    findGroundBelow(centerX, minY = 180) {
        let bestY = Infinity;
        for (let b of this.levelBlocks) {
            if (centerX >= b.x && centerX <= b.x + b.w && b.y >= minY && b.y < bestY) {
                bestY = b.y;
            }
        }
        return bestY;
    },

    dropVillainHazard() {
        const v = this.villain;
        if (!v) return;
        const cfg = this.getVillainConfig();

        // Check active caps and ground availability directly behind villain
        const dropX = v.x - 8;
        const groundY = this.findGroundBelow(dropX, 180);
        const hasGround = groundY < Infinity;

        let activeGoons = 0;
        for (let m of this.minions) {
            if (m.isVillainMinion) activeGoons++;
        }

        const canTrap = hasGround && this.villainTraps.length < cfg.maxTraps;
        const canGoon = hasGround && activeGoons < cfg.maxGoons;

        // Avoid placing a trap directly on top of another trap/spike/fire jet
        let trapSpotClear = canTrap;
        if (trapSpotClear) {
            for (let t of this.villainTraps) {
                if (Math.abs((t.x + t.w / 2) - dropX) < 48) { trapSpotClear = false; break; }
            }
        }
        if (trapSpotClear) {
            for (let s of this.tikiSpikes) {
                if (Math.abs((s.x + s.w / 2) - dropX) < 44) { trapSpotClear = false; break; }
            }
        }
        if (trapSpotClear) {
            for (let f of this.tikiFireJets) {
                if (Math.abs((f.x + f.w / 2) - dropX) < 44) { trapSpotClear = false; break; }
            }
        }

        // Weighted selection between bomb, trap, and villain goon
        const roll = Math.random();
        let choice = 'bomb';
        if (roll < 0.36) {
            choice = 'bomb';
        } else if (roll < 0.68 && trapSpotClear) {
            choice = 'trap';
        } else if (canGoon) {
            choice = 'goon';
        } else if (trapSpotClear) {
            choice = 'trap';
        }

        if (choice === 'trap') {
            this.villainTraps.push({
                x: dropX - 18,
                y: groundY - 26,
                w: 36,
                h: 26,
                life: 900,
                maxLife: 900,
                frame: 0
            });
        } else if (choice === 'goon') {
            const size = cfg.goonHp > 1 ? 44 : 38;
            const dir = this.player.x <= v.x ? -1 : 1;
            this.minions.push({
                x: dropX - size / 2,
                y: Math.min(v.y + v.h - size, groundY - size - 4),
                w: size,
                h: size,
                hp: cfg.goonHp,
                maxHp: cfg.goonHp,
                vx: dir * cfg.goonSpeed,
                vy: -4,
                isVillainMinion: true,
                isBossMinion: false,
                hitTimer: 0,
                frame: 0
            });
        } else {
            // Villain time-bomb tossed out rear chute
            this.villainBombs.push({
                x: dropX,
                y: v.y + v.h * 0.55,
                vx: -2.0 - Math.random() * 1.4,
                vy: -4.2 - Math.random() * 1.2,
                r: 13,
                fuse: cfg.bombFuse,
                maxFuse: cfg.bombFuse,
                frame: 0
            });
        }

        v.dropFlash = 14;
        AudioEngine.playSFX('villainDrop');
        for (let p = 0; p < 10; p++) {
            this.particles.push({
                x: v.x,
                y: v.y + v.h * 0.55,
                vx: -2 - Math.random() * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 18,
                color: p % 2 === 0 ? '#9b59b6' : '#fdcb6e'
            });
        }
    },

    updateVillain() {
        const v = this.villain;
        if (!v || this.gameState !== 'playing') return;

        const cfg = this.getVillainConfig();
        v.frame++;
        if (v.dropFlash > 0) v.dropFlash--;
        if (v.stunImmunity > 0) v.stunImmunity--;

        // Compute target horizontal speed with fair rubber-banding
        const delta = v.x - this.player.x;
        if (v.stunTimer > 0) {
            v.stunTimer--;
            v.vx += (0.4 - v.vx) * 0.14;
            if (v.frame % 6 === 0) {
                this.particles.push({
                    x: v.x + v.w * 0.5,
                    y: v.y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -1.5 - Math.random() * 2,
                    life: 22,
                    color: '#636e72'
                });
            }
        } else {
            let targetVx = cfg.baseSpeed + Math.sin(v.frame * 0.03) * 0.35;
            if (delta > 480) {
                targetVx = cfg.aheadSpeed;
                // While player is fighting a live boss and rival is past the boss, ease up slightly on Easy/Medium
                if (this.boss && this.boss.hp > 0 && v.x > this.boss.x + 150 && this.villainDifficulty !== 'hard') {
                    targetVx *= 0.72;
                }
            } else if (delta < -140) {
                targetVx = cfg.behindSpeed;
            }
            v.vx += (targetVx - v.vx) * 0.06;
        }

        v.x += v.vx;
        if (v.x < 40) {
            v.x = 40;
            if (v.vx < 0) v.vx = 0;
        }
        v.wheelRot += v.vx * 0.12;

        // Terrain-following & hover-skimming (Villain NEVER stomps or kills normal enemies; he glides past them!)
        const centerX = v.x + v.w * 0.5;
        let groundY = this.findGroundBelow(centerX, 260);
        let targetY = 315;
        let hovering = true;

        // Check ramps under villain
        for (let r of this.ramps) {
            if (centerX >= r.x && centerX <= r.x + r.w && r.y >= 240) {
                const relX = Math.max(0, Math.min(r.w, centerX - r.x));
                const rampY = r.dir === 1
                    ? r.y + r.h - (relX / r.w) * r.h
                    : r.y + (relX / r.w) * r.h;
                if (rampY < groundY) groundY = rampY;
            }
        }

        if (groundY < Infinity) {
            targetY = groundY - v.h;
            hovering = false;
        }

        // Hover smoothly over totems and bosses ahead without colliding or damaging them
        for (let t of this.tikiTotems) {
            if (t.x + t.w > v.x - 25 && t.x < v.x + v.w + 55) {
                targetY = Math.min(targetY, t.y - v.h - 14);
                hovering = true;
            }
        }
        if (this.boss && this.boss.hp > 0 && Math.abs((v.x + v.w / 2) - this.boss.x) < this.boss.w * 0.75) {
            targetY = Math.min(targetY, this.boss.y - this.boss.h * 0.5 - v.h - 12);
            hovering = true;
        }

        v.isHovering = hovering;
        v.y += (targetY - v.y) * 0.18;

        // Drop bombs / traps / own guys when near active racing range (never spawning directly on top of player)
        if (v.stunTimer <= 0 && !v.finished) {
            const inRaceRange = v.x > this.player.x - 320 && v.x < this.player.x + 860;
            if (inRaceRange) {
                v.dropCooldown--;
                const safeDistFromPlayer = Math.abs((v.x + v.w / 2) - (this.player.x + this.player.w / 2)) > 95;
                if (v.dropCooldown <= 0 && safeDistFromPlayer) {
                    this.dropVillainHazard();
                    v.dropCooldown = cfg.dropMinCd + Math.floor(Math.random() * (cfg.dropMaxCd - cfg.dropMinCd));
                }
            }
        }

        // Player vs Villain interaction: stomp roof to bounce & stun, or side fender bump
        if (!this.player.dead &&
            this.player.x + this.player.w > v.x && this.player.x < v.x + v.w &&
            this.player.y + this.player.h > v.y && this.player.y < v.y + v.h) {
            if (this.player.vy > 0 && this.player.y + this.player.h - this.player.vy <= v.y + 18) {
                // Stomp villain roof to stun him and bounce safely!
                this.player.vy = -12;
                this.player.jumpsRemaining = 1;
                this.player.jumpGraceTimer = 5;
                this.stunVillain(200);
            } else if (v.stunTimer <= 0 && !this.player.isInvincible) {
                // Non-lethal fender rub nudge + sparks
                this.player.vx = (this.player.x < v.x) ? Math.min(this.player.vx, -2.5) : Math.max(this.player.vx, 4.5);
                if (v.frame % 8 === 0) {
                    AudioEngine.playSFX('hit');
                    for (let p = 0; p < 6; p++) {
                        this.particles.push({
                            x: (this.player.x + v.x + v.w / 2) / 2,
                            y: v.y + v.h * 0.5,
                            vx: (Math.random() - 0.5) * 6,
                            vy: -2 - Math.random() * 4,
                            life: 16,
                            color: '#fdcb6e'
                        });
                    }
                }
            }
        }

        // Alert player once when Rival is approaching the finish line
        if (this.goal && !this.villainWarningPlayed && this.goal.x - v.x < 1600 && this.player.x < this.goal.x - 400) {
            this.villainWarningPlayed = true;
            AudioEngine.playSFX('rivalWarning');
        }

        // Check if Villain beat the player to the Goal!
        if (this.goal && v.x + v.w >= this.goal.x && !v.finished) {
            v.finished = true;
            this.gameState = 'gameover';
            AudioEngine.stopMusic();
            AudioEngine.playSFX('wreck');
            const goOverlay = document.getElementById('gameover-overlay');
            const goH2 = goOverlay.querySelector('h2');
            const goP = goOverlay.querySelector('p');
            if (goH2) goH2.innerText = 'OUTRACED!';
            if (goP) goP.innerText = `${cfg.name} crossed the finish line first! Try again and boost past them!`;
            goOverlay.classList.add('active');
        }
    },

    updateVillainDrops() {
        // 1. Update Villain Bombs
        for (let i = this.villainBombs.length - 1; i >= 0; i--) {
            const vb = this.villainBombs[i];
            vb.frame++;
            vb.fuse--;
            vb.vy += 0.35; // gravity
            vb.x += vb.vx;
            vb.y += vb.vy;

            // Bounce on solid wood platforms
            for (let b of this.levelBlocks) {
                if (vb.vy >= 0 &&
                    vb.y + vb.r >= b.y && vb.y + vb.r - vb.vy <= b.y + 12 &&
                    vb.x + vb.r > b.x && vb.x - vb.r < b.x + b.w) {
                    vb.y = b.y - vb.r;
                    vb.vy = -Math.abs(vb.vy) * 0.45;
                    vb.vx *= 0.72;
                    if (Math.abs(vb.vy) < 1.2) vb.vy = 0;
                    break;
                }
            }

            // Direct player touch detonates bomb immediately
            if (!this.player.dead &&
                this.player.x + this.player.w > vb.x - vb.r && this.player.x < vb.x + vb.r &&
                this.player.y + this.player.h > vb.y - vb.r && this.player.y < vb.y + vb.r) {
                this.explodeVillainBomb(vb, true);
                this.villainBombs.splice(i, 1);
                continue;
            }

            // Fuse expired -> explode!
            if (vb.fuse <= 0) {
                this.explodeVillainBomb(vb, true);
                this.villainBombs.splice(i, 1);
                continue;
            }

            // Fell into pit
            if (vb.y > 650) {
                this.villainBombs.splice(i, 1);
            }
        }

        // 2. Update Villain Traps
        for (let i = this.villainTraps.length - 1; i >= 0; i--) {
            const vt = this.villainTraps[i];
            vt.frame++;
            vt.life--;

            if (vt.life <= 0) {
                this.villainTraps.splice(i, 1);
                continue;
            }

            // Collision with player (lethal spike trap)
            if (!this.player.dead &&
                this.player.x + this.player.w > vt.x + 5 && this.player.x < vt.x + vt.w - 5 &&
                this.player.y + this.player.h > vt.y + 8 && this.player.y < vt.y + vt.h) {
                this.playerDie();
                // Shatter trap on impact so player doesn't double-hit
                this.villainTraps.splice(i, 1);
            }
        }
    },

    drawRaceProgressHud() {
        if (!this.goal || !this.villain || this.gameState === 'menu' || this.gameState === 'character_select') return;
        const ctx = this.ctx;
        const barW = 360;
        const barH = 22;
        const barX = (this.canvas.width - barW) / 2;
        const barY = 14;
        const maxX = Math.max(1, this.goal.x);

        const playerPct = Math.max(0, Math.min(1, this.player.x / maxX));
        const villainPct = Math.max(0, Math.min(1, this.villain.x / maxX));

        ctx.save();
        // Translucent pill background
        ctx.fillStyle = 'rgba(20, 28, 38, 0.72)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barX, barY, barW, barH);

        // Track rail inside pill
        const trackX = barX + 18;
        const trackW = barW - 36;
        const trackY = barY + barH / 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(trackX, trackY);
        ctx.lineTo(trackX + trackW, trackY);
        ctx.stroke();

        // Finish line flag marker at right end
        ctx.fillStyle = '#fdcb6e';
        ctx.fillRect(trackX + trackW - 2, barY + 4, 4, barH - 8);

        // Boss marker if alive
        if (this.boss && this.boss.hp > 0) {
            const bossPct = Math.max(0, Math.min(1, this.boss.x / maxX));
            ctx.fillStyle = '#e17055';
            ctx.beginPath();
            ctx.arc(trackX + trackW * bossPct, trackY, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Villain marker (crimson/purple)
        const vx = trackX + trackW * villainPct;
        ctx.fillStyle = '#ff3838';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(vx, trackY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Player marker (turquoise)
        const px = trackX + trackW * playerPct;
        ctx.fillStyle = '#00cec9';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, trackY, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Off-screen directional indicator for Villain
        const villainScreenX = this.villain.x - this.scrollX;
        const distMeters = Math.round(Math.abs(this.villain.x - this.player.x) / 10);
        if (villainScreenX > this.canvas.width - 10) {
            ctx.fillStyle = 'rgba(214, 48, 49, 0.88)';
            ctx.fillRect(this.canvas.width - 122, 52, 110, 24);
            ctx.strokeStyle = '#fdcb6e';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(this.canvas.width - 122, 52, 110, 24);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`RIVAL ${distMeters}m →`, this.canvas.width - 67, 64);
        } else if (villainScreenX + this.villain.w < 10) {
            ctx.fillStyle = 'rgba(0, 184, 148, 0.85)';
            ctx.fillRect(12, 52, 110, 24);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(12, 52, 110, 24);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`← RIVAL ${distMeters}m`, 67, 64);
        }

        // Urgent flashing warning when Rival is close to the Finish Line
        if (this.goal.x - this.villain.x < 1600 && !this.villain.finished && Math.floor(this.globalFrame / 15) % 2 === 0) {
            ctx.fillStyle = 'rgba(214, 48, 49, 0.9)';
            ctx.fillRect(this.canvas.width / 2 - 120, 44, 240, 24);
            ctx.fillStyle = '#fdcb6e';
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚠ RIVAL NEARING FINISH! ⚠', this.canvas.width / 2, 56);
        }

        ctx.restore();
    },

    loop(timestamp) {
        this.update();
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    },

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background birds
        for (let b of this.bgBirds) {
            this.ctx.save();
            const alpha = 0.1 + (b.size - 0.15) * 1.0;
            this.ctx.globalAlpha = Math.max(0.12, Math.min(0.32, alpha));
            Assets.drawBird(this.ctx, b.x, b.y, 40 * b.size, 30 * b.size, b.flapOffset);
            this.ctx.restore();
        }

        this.ctx.save();
        this.ctx.translate(-this.scrollX, 0);

        // Draw Gaps (Water, Jungle Canopy, or Lava)
        for (let w of this.swampGaps) {
            if (this.levelIndex === 1) {
                // Water body
                this.ctx.fillStyle = '#00cec9';
                this.ctx.fillRect(w.x, w.y + 40, w.w, 600);
                
                // Waves
                this.ctx.fillStyle = '#0984e3';
                this.ctx.beginPath();
                this.ctx.moveTo(w.x, w.y + 600);
                this.ctx.lineTo(w.x, w.y + 40);
                for (let px = w.x; px <= w.x + w.w; px += 10) {
                    let waveHeight = Math.sin((px + this.globalFrame * 2) * 0.05) * 10;
                    this.ctx.lineTo(px, w.y + 40 + waveHeight);
                }
                this.ctx.lineTo(w.x + w.w, w.y + 600);
                this.ctx.fill();

                // Top wave highlights
                this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
                this.ctx.beginPath();
                this.ctx.moveTo(w.x, w.y + 600);
                this.ctx.lineTo(w.x, w.y + 35);
                for (let px = w.x; px <= w.x + w.w; px += 10) {
                    let waveHeight = Math.sin((px + this.globalFrame * 2 + 10) * 0.05) * 5;
                    this.ctx.lineTo(px, w.y + 35 + waveHeight);
                }
                this.ctx.lineTo(w.x + w.w, w.y + 600);
                this.ctx.fill();
            } else if (this.levelIndex === 2) {
                // Background leaves
                this.ctx.fillStyle = Assets.swampDeep;
                this.ctx.beginPath();
                this.ctx.moveTo(w.x, w.y + 600);
                this.ctx.lineTo(w.x, w.y + 30);
                for (let px = w.x; px <= w.x + w.w; px += 20) {
                    let leafHeight = (px % 40 === 0) ? 15 : -5;
                    this.ctx.lineTo(px, w.y + 30 + leafHeight);
                }
                this.ctx.lineTo(w.x + w.w, w.y + 600);
                this.ctx.fill();

                // Foreground leaves
                this.ctx.fillStyle = Assets.swampGreen;
                this.ctx.beginPath();
                this.ctx.moveTo(w.x, w.y + 600);
                this.ctx.lineTo(w.x, w.y + 40);
                for (let px = w.x; px <= w.x + w.w; px += 15) {
                    let leafHeight = (px % 30 === 0) ? 15 : -5;
                    this.ctx.lineTo(px, w.y + 40 + leafHeight);
                }
                this.ctx.lineTo(w.x + w.w, w.y + 600);
                this.ctx.fill();
                
                // Add some thorny details or vine accents
                this.ctx.strokeStyle = '#1e8449';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                for (let px = w.x; px <= w.x + w.w; px += 30) {
                    this.ctx.moveTo(px, w.y + 40);
                    this.ctx.lineTo(px - 10, w.y + 20);
                    this.ctx.lineTo(px + 10, w.y + 30);
                }
                this.ctx.stroke();
            } else if (this.levelIndex === 3) {
                // Lava body
                Assets.drawLava(this.ctx, w.x, w.y, w.w, 600, this.globalFrame);
            }
        }

        // Draw Blocks
        for (let b of this.levelBlocks) {
            Assets.drawWoodPlatform(this.ctx, b.x, b.y, b.w, b.h);
            if (b.vineLength > 0) {
                Assets.drawVine(this.ctx, b.x + b.w/2, b.y + b.h, b.vineLength);
            }
        }

        // Draw Ramps
        for (let r of this.ramps) {
            Assets.drawRamp(this.ctx, r.x, r.y, r.w, r.h, r.dir);
        }

        // Draw Tiki Spikes
        for (let s of this.tikiSpikes) {
            Assets.drawTikiSpikes(this.ctx, s.x, s.y, s.w, s.h, this.levelIndex);
        }

        // Draw Tiki Totems
        for (let t of this.tikiTotems) {
            Assets.drawTikiTotem(this.ctx, t.x, t.y, t.w, t.h, t.hp);
        }

        // Draw Tiki Fire Jets
        for (let f of this.tikiFireJets) {
            Assets.drawTikiFireJet(this.ctx, f.x, f.y, f.w, f.h, f.frameCycle, this.globalFrame);
        }

        // Draw Goal
        if (this.goal) {
            Assets.drawOKPipe(this.ctx, this.goal.x, this.goal.y - 100, 80, 140);
        }

        // Draw Boss
        if (this.boss) {
            Assets.drawBoss(this.ctx, this.boss.x, this.boss.y, this.boss.w, this.boss.h, this.boss.frame, this.boss.hitTimer > 0, this.boss.vx > 0, this.levelIndex, this.boss.hp, this.boss.maxHp);
        }

        // Draw Boss Pineapples
        for (let bp of this.bossPineapples) {
            Assets.drawSpear(this.ctx, bp.x, bp.y, bp.w, bp.h, bp.facingRight);
        }

        // Draw Minions (normal, boss minions, and Villain's own goons)
        for (let m of this.minions) {
            if (m.isVillainMinion) {
                Assets.drawVillainMinion(this.ctx, m.x, m.y, m.w, m.h, m.frame, m.hitTimer > 0, (m.maxHp || 1) > 1);
            } else {
                Assets.drawMinion(this.ctx, m.x, m.y, m.w, m.h, m.frame, m.hitTimer > 0, m.isBossMinion);
            }
        }

        // Draw Villain Dropped Traps
        for (let vt of this.villainTraps) {
            Assets.drawVillainTrap(this.ctx, vt.x, vt.y, vt.w, vt.h, vt.frame, vt.life / vt.maxLife);
        }

        // Draw Villain Dropped Time-Bombs
        for (let vb of this.villainBombs) {
            Assets.drawVillainBomb(this.ctx, vb.x, vb.y, vb.r, vb.frame, vb.fuse / vb.maxFuse);
        }

        // Draw Villain Competitor Racer
        if (this.villain) {
            Assets.drawVillainRacer(
                this.ctx,
                this.villain.x,
                this.villain.y,
                this.villain.w,
                this.villain.h,
                this.villain.wheelRot,
                this.villain.frame,
                this.villainDifficulty,
                this.villain.isHovering,
                this.villain.stunTimer,
                this.villain.dropFlash
            );
        }

        // Draw Elevators
        for (let e of this.elevators) {
            Assets.drawElevator(this.ctx, e.x, e.y, e.w, e.h);
        }

        // Draw QBlocks
        for (let q of this.qblocks) {
            Assets.drawQuestionBlock(this.ctx, q.x, q.y, q.w, q.h, q.active);
        }

        // Draw Hazards
        for (let h of this.hazards) {
            Assets.drawHazard(this.ctx, h.x, h.y, h.r, h.frame);
        }

        // Draw Cage
        if (this.birdCage) {
            Assets.drawCage(this.ctx, this.birdCage.x, this.birdCage.y, this.birdCage.w, this.birdCage.h);
        }

        // Draw Coconut Bombs
        for (let cb of this.coconutBombs) {
            Assets.drawCoconutBomb(this.ctx, cb.x, cb.y, cb.r);
        }

        // Draw Pineapple Bubbles
        for (let pb of this.pineappleBubbles) {
            Assets.drawFruitBubble(this.ctx, pb.x, pb.y, pb.r, pb.frame);
        }

        // Draw Collectibles
        for (let c of this.collectibles) {
            if (c.type === 'pineapple') {
                Assets.drawPineappleCollectible(this.ctx, c.x + c.w/2, c.y + c.h/2, 12, this.globalFrame);
            } else {
                Assets.drawCoconutCollectible(this.ctx, c.x + c.w/2, c.y + c.h/2, 12, this.globalFrame);
            }
        }

        // Draw Volcano Vents
        for (let v of this.volcanoVents) {
            Assets.drawSteamVent(this.ctx, v.x, v.y, v.w, v.h, v.activeTimer);
        }

        // Draw Particles
        for (let p of this.particles) {
            this.ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 30));
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        }
        this.ctx.globalAlpha = 1.0;

        // Draw Player
        if (!this.player.dead) {
            this.ctx.save();
            // Only flash opacity for damage-respawn invincibility, not during Rescue Board/Boat mode
            if (this.player.isInvincible && !this.player.specialActive && Math.floor(Date.now() / 100) % 2 === 0) {
                this.ctx.globalAlpha = 0.35;
            }
            if (this.player.specialActive) {
                if (this.selectedVehicle === 'jeep' || this.selectedVehicle === 'speeder') {
                    Assets.drawSurfboardRescue(this.ctx, this.player.x, this.player.y, this.player.w, this.player.h, this.selectedVehicle, this.player.wheelRot, this.player.isFlying);
                } else if (this.selectedVehicle === 'tank') {
                    Assets.drawDuckBoatRescue(this.ctx, this.player.x, this.player.y, this.player.w, this.player.h, this.player.x * 0.1, this.player.isFlying);
                }
            } else {
                if (this.selectedVehicle === 'jeep') {
                    Assets.drawJeep(this.ctx, this.player.x, this.player.y, this.player.w, this.player.h, this.player.wheelRot, this.player.isFlying);
                } else if (this.selectedVehicle === 'speeder') {
                    Assets.drawSpeeder(this.ctx, this.player.x, this.player.y, this.player.w, this.player.h, this.player.x * 0.05, this.player.isFlying);
                } else if (this.selectedVehicle === 'tank') {
                    Assets.drawTank(this.ctx, this.player.x, this.player.y, this.player.w, this.player.h, this.player.x * 0.1, this.player.isFlying);
                }
            }
            this.ctx.globalAlpha = 1.0;
            
            // Boost effect
            if (this.player.isBoosting && Math.abs(this.player.vx) > 0.5) {
                this.ctx.fillStyle = '#ff9a44';
                this.ctx.beginPath();
                if (this.player.vx > 0) {
                    this.ctx.moveTo(this.player.x, this.player.y + this.player.h*0.8);
                    this.ctx.lineTo(this.player.x - 30 - Math.random()*20, this.player.y + this.player.h*0.8);
                    this.ctx.lineTo(this.player.x, this.player.y + this.player.h);
                } else {
                    this.ctx.moveTo(this.player.x + this.player.w, this.player.y + this.player.h*0.8);
                    this.ctx.lineTo(this.player.x + this.player.w + 30 + Math.random()*20, this.player.y + this.player.h*0.8);
                    this.ctx.lineTo(this.player.x + this.player.w, this.player.y + this.player.h);
                }
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        this.ctx.restore();

        // Screen-space Race Progress Bar & Rival Offscreen Indicators
        this.drawRaceProgressHud();
    }
};

window.onload = () => Game.init();
