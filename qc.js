const fs = require('fs');
const vm = require('vm');

let passed = 0;
let failed = 0;

function assert(cond, msg) {
    if (cond) {
        passed++;
    } else {
        failed++;
        console.error(`  [FAIL] ${msg}`);
    }
}

console.log('====================================================');
console.log('   OK DERBY - AUTOMATED QC & GAMEPLAY VERIFICATION  ');
console.log('====================================================\n');

// 1. Check JS Syntax for all core files
for (const file of ['audio.js', 'assets.js', 'game.js']) {
    try {
        const src = fs.readFileSync(file, 'utf8');
        new vm.Script(src, { filename: file });
        console.log(`[PASS] Syntax check: ${file}`);
        passed++;
    } catch (err) {
        console.error(`[FAIL] Syntax error in ${file}:`, err.message);
        failed++;
    }
}

// 2. Load into a mock DOM + Canvas 2D context to test actual Game engine
const elements = {};
function getMockEl(id) {
    if (!elements[id]) {
        elements[id] = {
            id,
            innerText: '',
            className: '',
            style: { display: 'block' },
            dataset: {},
            width: 960,
            height: 540,
            classList: {
                _set: new Set(),
                add(c) { this._set.add(c); },
                remove(c) { this._set.delete(c); },
                toggle(c, force) {
                    if (force === undefined) {
                        if (this._set.has(c)) { this._set.delete(c); return false; }
                        this._set.add(c); return true;
                    }
                    if (force) this._set.add(c); else this._set.delete(c);
                    return force;
                },
                contains(c) { return this._set.has(c); }
            },
            addEventListener() {},
            querySelector(sel) {
                if (!this._children) this._children = {};
                if (!this._children[sel]) {
                    this._children[sel] = { innerText: '', className: '' };
                }
                return this._children[sel];
            },
            closest() { return { dataset: { level: '1' } }; },
            getContext() {
                return new Proxy({}, {
                    get(target, prop) {
                        if (prop === 'createLinearGradient' || prop === 'createRadialGradient') {
                            return () => ({ addColorStop() {} });
                        }
                        return () => {};
                    },
                    set() { return true; }
                });
            }
        };
    }
    return elements[id];
}

const sandbox = {
    window: {
        addEventListener() {},
        AudioContext: function() {
            this.currentTime = 0;
            this.state = 'running';
            this.destination = {};
            this.resume = () => {};
            this.createOscillator = () => ({
                type: 'sine',
                frequency: { setValueAtTime() {} },
                connect() {},
                start() {},
                stop() {}
            });
            this.createGain = () => ({
                gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
                connect() {}
            });
        }
    },
    document: {
        getElementById: (id) => getMockEl(id),
        querySelectorAll: () => [],
        querySelector: () => getMockEl('floor')
    },
    requestAnimationFrame: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    setTimeout: () => 1,
    Date,
    Math,
    console
};

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('audio.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('assets.js', 'utf8'), sandbox);
vm.runInContext(fs.readFileSync('game.js', 'utf8'), sandbox);

const Game = vm.runInContext('Game', sandbox);
const Assets = vm.runInContext('Assets', sandbox);
const AudioEngine = vm.runInContext('AudioEngine', sandbox);

Game.init();

// 3. Level Geometry & Reachability Checks
for (const levelKey of [1, 2, 3]) {
    console.log(`\n--- Checking Stage ${levelKey} Geometry & Entities ---`);
    const map = Game.levels[levelKey];
    const height = map.length;
    const width = map[0].length;
    assert(height === 12 && width === 368, `Stage ${levelKey} dimensions are ${width}x${height} (expected 368x12)`);

    for (let r = 0; r < height; r++) {
        assert(map[r].length === width, `Stage ${levelKey} row ${r} length is ${map[r].length} (expected ${width})`);
    }

    // Check that no *, #, T exist in Row 10
    for (let c = 0; c < width; c++) {
        const ch10 = map[10][c];
        assert(!['*', '#', 'T'].includes(ch10), `Stage ${levelKey} col ${c}: Row 10 has '${ch10}' instead of ground/gap`);
    }

    // Check that every *, #, T, m, M, E, 1 has solid ground 'S' directly below it
    for (let r = 0; r < height - 1; r++) {
        for (let c = 0; c < width; c++) {
            const ch = map[r][c];
            if (['*', '#', 'T', 'm', 'M', '1', 'E'].includes(ch)) {
                const below = map[r + 1][c];
                assert(below === 'S', `Stage ${levelKey} '${ch}' at (r=${r}, c=${c}) has '${below}' below it (expected 'S')`);
            }
        }
    }

    // Load level into Game and test entity counts & rendering
    Game.startLevel(levelKey, false);
    assert(Game.boss !== null && Game.boss.hp === 15, `Stage ${levelKey} boss spawned with 15 HP`);
    assert(Game.goal !== null, `Stage ${levelKey} goal spawned`);
    assert(Game.elevators.length >= 2, `Stage ${levelKey} has ${Game.elevators.length} elevators (expected >= 2)`);
    assert(Game.tikiSpikes.length > 0, `Stage ${levelKey} has ${Game.tikiSpikes.length} Tiki Spikes`);
    assert(Game.tikiTotems.length > 0, `Stage ${levelKey} has ${Game.tikiTotems.length} Tiki Totems`);
    assert(Game.tikiFireJets.length > 0, `Stage ${levelKey} has ${Game.tikiFireJets.length} Tiki Fire Jets`);

    // Check max gap between platforms (considering Row 8/9/10 platforms)
    let lastSolidCol = 0;
    let maxGapCols = 0;
    for (let c = 0; c < width; c++) {
        const hasPlatform = map[8][c] === 'S' || map[9][c] === 'S' || map[10][c] === 'S' || map[9][c] === '/' || map[9][c] === '^';
        if (hasPlatform) {
            const gap = c - lastSolidCol - 1;
            if (gap > maxGapCols) maxGapCols = gap;
            lastSolidCol = c;
        }
    }
    console.log(`  Max platform gap in Stage ${levelKey}: ${maxGapCols} cols (${maxGapCols * 40}px)`);
    assert(maxGapCols <= 15, `Stage ${levelKey} max platform gap is ${maxGapCols} cols (must be <= 15 cols to be jumpable)`);

    // Verify draw() executes without errors on this stage
    try {
        Game.update();
        Game.draw();
        passed++;
    } catch (e) {
        failed++;
        console.error(`  [FAIL] Stage ${levelKey} update/draw threw error:`, e);
    }
}

// 4. Gameplay Mechanics & Regression Tests
console.log('\n--- Running Gameplay Mechanics & Regression Suite ---');

// 4a. Distinct Vehicle Stats
Game.selectedVehicle = 'jeep';
Game.startLevel(1);
assert(Game.player.speedCap === 6.8 && Game.player.projectileDamage === 1, 'Jeep stats applied correctly');

Game.selectedVehicle = 'speeder';
Game.startLevel(1);
assert(Game.player.speedCap === 7.6 && Game.player.specialDuration === 390, 'Speeder stats applied correctly');

Game.selectedVehicle = 'tank';
Game.startLevel(1);
assert(Game.player.speedCap === 6.3 && Game.player.projectileDamage === 2 && Game.player.maxProjectiles === 4, 'Tank stats applied correctly');

// 4a2. Double Jump mechanics (ground jump -> mid-air 2nd jump -> no 3rd jump -> resets on landing)
Game.selectedVehicle = 'jeep';
Game.startLevel(1);
Game.player.isGrounded = true;
Game.player.jumpsRemaining = 2;
Game.triggerJump();
assert(!Game.player.isGrounded && Game.player.vy < -10 && Game.player.jumpsRemaining === 1, '1st jump launches vehicle and leaves 1 mid-air jump');
Game.player.vy = 2; // falling mid-air
Game.triggerJump();
assert(Game.player.vy < -10 && Game.player.jumpsRemaining === 0, '2nd jump (Double Jump) launches vehicle mid-air and uses remaining jump');
Game.player.vy = 2;
Game.triggerJump();
assert(Game.player.vy === 2, '3rd mid-air jump is prevented until landing');

// 4b. Jump on Up-Ramp & Elevator not eaten
Game.selectedVehicle = 'jeep';
Game.startLevel(1);
const ramp = Game.ramps.find(r => r.dir === 1);
Game.player.x = ramp.x;
Game.player.y = ramp.y;
Game.player.vx = 8;
Game.player.isGrounded = true;
Game.triggerJump();
Game.update();
assert(Game.player.vy < -8 && !Game.player.isGrounded, `Jump on up-ramp preserved upward velocity (vy=${Game.player.vy.toFixed(2)})`);

// 4c. 2-HP Minion takes 2 hits with Jeep (1 dmg) and 1 hit with Tank (2 dmg)
Game.selectedVehicle = 'jeep';
Game.startLevel(1);
const bossMinion = Game.minions.find(m => m.hp === 2);
assert(!!bossMinion, 'Found 2-HP boss minion');
const initialMinionCount = Game.minions.length;
Game.scrollX = bossMinion.x - 200;
Game.coconutBombs.push({ x: bossMinion.x + 10, y: bossMinion.y + 10, vx: 0, vy: 0, r: 10, damage: 1 });
Game.update();
assert(bossMinion.hp === 1 && Game.minions.length === initialMinionCount, '2-HP minion survived 1st 1-dmg hit with 1 HP remaining');
Game.coconutBombs.push({ x: bossMinion.x + 10, y: bossMinion.y + 10, vx: 0, vy: 0, r: 10, damage: 1 });
Game.update();
assert(Game.minions.length === initialMinionCount - 1, '2-HP minion defeated on 2nd 1-dmg hit');

// 4d. Stage 3 Steam Vent Triggering on Platform
Game.startLevel(3);
const vent = Game.volcanoVents[0];
Game.player.x = vent.x;
Game.player.y = vent.y; // player bottom at vent.y + 40
Game.player.vy = 0;
Game.update();
assert(Game.player.vy < -10 && vent.activeTimer > 0, `Stage 3 Steam Vent launched player (vy=${Game.player.vy.toFixed(2)})`);

// 4e. Boss Stomp during hitInvincible still bounces player safely
Game.startLevel(1);
Game.boss.y = 290; // standing on y=400 floor (290 + 110 = 400)
Game.boss.vy = 0;
Game.boss.hitInvincible = 25;
Game.player.x = Game.boss.x - 20;
Game.player.y = 150; // player bottom at 190, crossing boss top (290 - 93.5 = 196.5) on next frame
Game.player.vy = 10;
Game.scrollX = Game.player.x - 300;
Game.update();
assert(Game.player.vy < -10 && !Game.player.dead, 'Player safely bounced off boss head even during boss hitInvincible frames');

// 4f. Boss Defeat -> Bird Cage -> Lei Flight -> Respawn Recovery
Game.startLevel(1);
Game.player.specialReady = false; // disable auto-rescue to test life loss respawn
Game.player.x = Game.boss.x - 200;
Game.scrollX = Game.player.x - 300;
Game.boss.hp = 1;
Game.coconutBombs.push({ x: Game.boss.x, y: Game.boss.y, vx: 0, vy: 0, r: 10, damage: 1 });
Game.update();
assert(Game.boss === null && Game.birdCage !== null && Game.bossDefeated === true, 'Boss defeated and Bird Cage spawned');

// Collect Bird Cage
Game.player.x = Game.birdCage.x;
Game.player.y = Game.birdCage.y - 40;
Game.update();
assert(Game.player.isFlying === true && Game.birdCage === null, 'Collecting Bird Cage activated Lei Flight');
assert( getMockEl('hud-bird-container').style.display === 'flex', 'Lei Flight HUD shown');

// Simulate dying during Lei Flight and respawning near boss arena
Game.player.lastSafeX = Game.bossSpawnX - 40;
Game.player.lastSafeY = 360;
Game.playerDie();
assert(Game.player.isFlying === false && getMockEl('hud-bird-container').style.display === 'none', 'Dying during Lei Flight resets flight state and hides flight HUD');
assert(Game.birdCage !== null, 'Bird Cage respawned at boss arena so player is not softlocked');

// 4g. Water/Lava surface during Rescue Mode does NOT overwrite lastSafeX
Game.startLevel(1);
const safeXBefore = Game.player.lastSafeX;
Game.deploySpecialRescue();
const gap = Game.swampGaps[50];
Game.player.x = gap.x;
Game.player.y = gap.y - Game.player.h;
Game.player.vy = 2;
Game.player.jumpGraceTimer = 0;
Game.update();
assert(Game.player.lastSafeX === safeXBefore, 'Surfing on water gap during Rescue Mode did not overwrite lastSafeX');

// 4h. Render Pipeline & Audio Engine Verification across all 3 Stages and Vehicles
let renderOk = true;
try {
    for (const [lvl, veh] of [[1, 'jeep'], [2, 'speeder'], [3, 'tank']]) {
        Game.selectedVehicle = veh;
        Game.startLevel(lvl);
        for (const scrollPos of [0, 3200, 10800]) {
            Game.scrollX = scrollPos;
            Game.player.x = scrollPos + 300;
            Game.draw();
        }
    }
} catch (err) {
    renderOk = false;
    console.error('Render error:', err);
}
assert(renderOk, 'Game.draw() and Assets rendered all 3 stages, bosses, obstacles, and vehicles without error');

// 4i. Independent SFX & Music Mute controls & Theme Lifecycle
assert(typeof AudioEngine.toggleSound === 'function' && typeof AudioEngine.toggleMusic === 'function', 'AudioEngine has independent SFX and Music mute toggles');
const initialMute = AudioEngine.isMuted;
const initialMusicMute = AudioEngine.isMusicMuted;
AudioEngine.toggleSound();
assert(AudioEngine.isMuted === !initialMute && AudioEngine.isMusicMuted === initialMusicMute, 'Toggling SFX mute does not alter Music mute state');
AudioEngine.toggleSound(); // restore

// Verify init starts main theme, stage levels set level1/2/3, and resume preserves active stage theme
Game.showScreen('main-menu-screen');
assert(AudioEngine.currentTheme === 'main' && AudioEngine.shouldPlayMusic === true, 'Main menu plays main theme');
Game.startLevel(2);
assert(AudioEngine.currentTheme === 'level2' && AudioEngine.shouldPlayMusic === true, 'Stage 2 plays level2 theme');
Game.togglePause();
assert(AudioEngine.shouldPlayMusic === false, 'Pausing stops music');
Game.togglePause();
assert(AudioEngine.currentTheme === 'level2' && AudioEngine.shouldPlayMusic === true, 'Unpausing Stage 2 resumes level2 theme (does not revert to main)');
Game.startLevel(3);
assert(AudioEngine.currentTheme === 'level3', 'Stage 3 plays level3 theme');
Game.showScreen('level-select-screen');
assert(AudioEngine.currentTheme === 'main' && AudioEngine.shouldPlayMusic === true, 'Returning to Stage Select plays main menu theme');

// 4j. Villain Competitor across all 3 stages and Easy/Medium/Hard difficulties
console.log('\n--- Running Villain Competitor Verification Suite ---');
for (const lvl of [1, 2, 3]) {
    Game.setVillainDifficulty('medium');
    Game.startLevel(lvl);
    assert(Game.villain !== null && !Game.villain.finished, `Stage ${lvl} spawns Villain Competitor`);
}

// Difficulty scaling checks
const easyCfg = Game.villainConfigs.easy;
const medCfg = Game.villainConfigs.medium;
const hardCfg = Game.villainConfigs.hard;
assert(easyCfg.baseSpeed < medCfg.baseSpeed && medCfg.baseSpeed < hardCfg.baseSpeed, 'Villain speed scales Easy < Medium < Hard');
assert(easyCfg.dropMinCd > medCfg.dropMinCd && medCfg.dropMinCd > hardCfg.dropMinCd, 'Villain drop frequency scales Easy < Medium < Hard');
assert(hardCfg.goonHp === 2 && easyCfg.goonHp === 1, 'Hard difficulty villain deploys armored 2-HP goons');

// Villain does NOT kill/stomp existing in-game minions or boss while racing past them
Game.setVillainDifficulty('medium');
Game.startLevel(1);
const initialBossHp = Game.boss.hp;
const testMinion = Game.minions[0];
const testMinionHp = testMinion.hp;
Game.villain.x = testMinion.x;
Game.villain.y = testMinion.y;
Game.villain.dropCooldown = 999; // isolate collision test
Game.update();
assert(testMinion.hp === testMinionHp && Game.minions.includes(testMinion), 'Villain does not stomp or damage in-game minions');
Game.villain.x = Game.boss.x;
Game.villain.y = Game.boss.y;
Game.update();
assert(Game.boss && Game.boss.hp === initialBossHp, 'Villain does not damage the stage boss');

// Villain drops bombs, traps, and his own goons
Game.setVillainDifficulty('hard');
Game.startLevel(1);
let sawBomb = false, sawTrap = false, sawGoon = false;
for (let attempt = 0; attempt < 40; attempt++) {
    Game.villain.x = 600 + attempt * 20;
    Game.villain.y = 356;
    Game.player.x = Game.villain.x - 180;
    Game.dropVillainHazard();
    if (Game.villainBombs.length > 0) sawBomb = true;
    if (Game.villainTraps.length > 0) sawTrap = true;
    if (Game.minions.some(m => m.isVillainMinion)) sawGoon = true;
    if (sawBomb && sawTrap && sawGoon) break;
}
assert(sawBomb, 'Villain drops time-bombs');
assert(sawTrap, 'Villain drops spiked traps on solid platforms');
assert(sawGoon, 'Villain deploys his own rival goons');

// Shooting villain stuns him; shooting bomb/trap destroys them
Game.setVillainDifficulty('medium');
Game.startLevel(1);
Game.villain.stunImmunity = 0;
Game.coconutBombs.push({ x: Game.villain.x + 20, y: Game.villain.y + 20, vx: 0, vy: 0, r: 10, damage: 1 });
Game.update();
assert(Game.villain.stunTimer > 0, 'Shooting Villain stuns and slows him down');

Game.villainBombs = [{ x: 400, y: 360, vx: 0, vy: 0, r: 13, fuse: 100, maxFuse: 100, frame: 0 }];
Game.coconutBombs.push({ x: 400, y: 360, vx: 0, vy: 0, r: 10, damage: 1 });
Game.update();
assert(Game.villainBombs.length === 0, 'Shooting Villain Bomb detonates it safely');

Game.villainTraps = [{ x: 450, y: 374, w: 36, h: 26, life: 500, maxLife: 500, frame: 0 }];
Game.coconutBombs.push({ x: 465, y: 385, vx: 0, vy: 0, r: 10, damage: 1 });
Game.update();
assert(Game.villainTraps.length === 0, 'Shooting Villain Trap shatters it');

// Villain reaching Goal first triggers OUTRACED game over
Game.setVillainDifficulty('medium');
Game.startLevel(1);
Game.villain.x = Game.goal.x - 10;
Game.update();
assert(Game.gameState === 'gameover' && Game.villain.finished === true, 'Villain reaching Goal first ends stage as OUTRACED');

// Player reaching Goal first wins with bonus score
Game.setVillainDifficulty('hard');
Game.startLevel(1);
const scoreBeforeWin = Game.score;
Game.player.x = Game.goal.x;
Game.update();
assert(Game.gameState === 'victory' && Game.score >= scoreBeforeWin + hardCfg.winBonus, 'Player beating Villain to Goal awards race win bonus');

// Draw pipeline renders Villain, Bombs, Traps, Goons, and Race HUD without error
let villainRenderOk = true;
try {
    for (const diff of ['easy', 'medium', 'hard']) {
        Game.setVillainDifficulty(diff);
        Game.startLevel(1);
        Game.villainBombs.push({ x: 320, y: 360, vx: 0, vy: 0, r: 13, fuse: 40, maxFuse: 100, frame: 10 });
        Game.villainTraps.push({ x: 380, y: 374, w: 36, h: 26, life: 400, maxLife: 900, frame: 10 });
        Game.minions.push({ x: 420, y: 360, w: 40, h: 40, hp: 2, maxHp: 2, vx: -2, vy: 0, isVillainMinion: true, hitTimer: 0, frame: 5 });
        Game.draw();
    }
} catch (err) {
    villainRenderOk = false;
    console.error('Villain render error:', err);
}
assert(villainRenderOk, 'Game.draw() rendered Villain Racer, Bombs, Traps, Rival Goons, and Race HUD across all difficulties');

console.log(`\n====================================================`);
console.log(`   QC SUMMARY: ${passed} passed, ${failed} failed`);
console.log(`====================================================`);
if (failed > 0) process.exit(1);
