# OK Derby - Master Game Specification & Design Notes

OK Derby is a browser-based vehicle platformer set in a tropical Hawaiian Tiki environment. The game combines physics-based driving, platform jumping, projectile-based combat, and boss battles into a fast-paced arcade experience.

---

## 1. Game Premise & Theme
*   **Setting:** A vibrant tropical paradise featuring turquoise oceans, palm-tree laden shorelines, dense jungle canopies, and volcanic caves.
*   **Visual Style:** Premium glassmorphism UI overlays over custom SVG/Canvas elements. 
*   **Thematic Assets:** Tiki masks, coconuts, surfboards, koa wood textures, hibiscus flowers, pineapples, and tropical birds.
*   **Audio Atmosphere:** Custom Web Audio API synthesizer that plays breezy triangle-wave ukulele melodies (Stage 1), syncopated marimba beats (Stage 2), and fiery volcanic tempos (Stage 3).

---

## 2. Vehicles & Tuning
Players select from three unique vehicles, each with custom canvas rendering and distinct driving physics in `game.js`:

| Vehicle Name | Key ID | Canvas Render Style | Speed Cap | Acceleration | Driving Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Aloha Cruiser** | `jeep` | Wood-paneled 4x4, hibiscus flower designs, carrying a surfboard. | `8.5` | `0.32` | Balanced standard vehicle; excellent all-around handling. |
| **Surf Speeder** | `speeder` | Sleek koa-wood hoverboard skimming above the track. | `9.5` | `0.38` | High top speed, agile jump (`13.0`), and extended `6.5s` Rescue Surfboard. |
| **Tiki Boom-Cart** | `tank` | Heavy hollowed-out koa trunk cart with a coconut launcher. | `8.0` | `0.28` | Heavy trunk cart; fires up to 4 projectiles dealing `2x` damage. |

---

## 3. Keyboard & Input Controls
The game handles key events globally:

*   **Move Left / Right:** `A` / `D` or `Left` / `Right` Arrow Keys.
*   **Boost (Speed Multiplier x1.5):** Hold `Shift` (Left or Right).
*   **Launch / Jump:** `Spacebar`, `W`, or `Up` Arrow (when grounded on solid surfaces, totems, elevators, or ramps).
*   **Flight Altitude Control:** `W` / `S` or `Up` / `Down` Arrow Keys (during active Lei Flight).
*   **Shoot Coconut Bombs:** `C` or `X` (Damages boss, totems & minions; max 3–4 on screen).
*   **Shoot Pineapple Bubbles:** `F` or `Z` (Floatier high-arc projectile; max 3–4 on screen).
*   **Deploy Rescue Board / Duck Boat:** `Q` (5.0s–6.5s water/lava skimming & invincibility; also auto-triggers once per stage on fatal hazard/fall).
*   **Pause / Resume:** `Esc` or pause overlay buttons.

---

## 4. Core Game Mechanics

### Movement & Physics
*   **Gravity:** Constant downward pull of `0.6` units per frame, suspended during active bird flight.
*   **Friction:** Applied at a rate of `0.95` when no movement keys are pressed and the vehicle is grounded.
*   **Ground Collision:** Snap-to-collision system utilizing a tolerance window and jump grace frames to prevent falling through moving platforms or eating jumps on ramps/elevators.
*   **Ramps:** Angles the vehicle and converts forward velocity into a vertical jump lift at ramp tips.
*   **Elevators:** Vertically moving wood platforms that toggle direction and pause for 1 second at maximum height/starting positions.

### Three-Life System
*   **Starting Lives:** Players are allotted exactly **3 lives** per level load.
*   **Loss of Life:** A life is lost if the player:
    1.  Collides with an active hazard (bird droppings, boss lava fireball, spikes, fire jet, minion contact).
    2.  Falls below the screen floor boundary (`y > 600`), representing water or lava gaps.
*   **Respawning:** If lives remain (`lives > 0`), the player loses a life and is teleported back to their last safe hazard-free grounded location with temporary invincibility (flashing) to continue the stage.
*   **Game Over:** If lives reach `0`, the stage fails, stopping music and showing the Game Over overlay.

### Bird Friend & Flight Mode
*   **Unlock:** Spawns automatically in a wooden cage at the boss coordinates when the level boss is defeated.
*   **Activation:** Colliding with the Bird Cage unlocks **10 seconds of flight**.
*   **Behavior:** Gravity is suspended, forward and vertical (`W`/`S` or `↑`/`↓`) control remains active to carry the player over treacherous platforming gaps.
*   **HUD Indicator:** Displays a countdown timer in the upper interface.

### Villain Competitor (Easy / Medium / Hard)
*   **Presence:** Active on all 3 stages, selectable via the Villain Difficulty setting on the Main Menu and Derby Stages screen (persisted in `localStorage`).
*   **Racing Behavior:** Rides a hover-equipped dark obsidian Tiki turbo-racer along the track, hovering smoothly over gaps, totems, and bosses. Never stomps or harms in-game minions or bosses.
*   **Hazard Drops:** While within active race range, drops three types of hazards from a rear drop-chute:
    1.  **Time-Bombs:** Bouncing iron Tiki bombs with pulsing blast rings that explode on timer expiration or contact (can be shot early for `+100` pts).
    2.  **Spiked Traps:** Jagged obsidian/crimson floor traps laid on solid wood platforms (can be jumped over or shot for `+100` pts).
    3.  **Rival Goons:** Custom villain-deployed Tiki Imps that charge toward the player (`1 HP` on Easy/Medium, armored `2 HP` on Hard; stompable/shootable).
*   **Counterplay & Race Outcome:** Shooting or stomping the Villain stuns and slows them down (`+150`–`+200` pts). Reaching the Goal first awards a difficulty-scaled win bonus (`+1500` / `+2500` / `+4000`); if the Villain reaches the Goal first, the stage ends as `OUTRACED!`.

---

## 5. Boss & Combat Mechanics
Each stage features a specialized boss occupying the boss arena of the level map (designated by `B` in ASCII map arrays):

*   **Tiki Boss Stats:** `15` Hit Points with an overhead health bar. Takes damage from player coconut bombs, pineapple bubbles, or direct jumps onto its head.
*   **Attack Volleys:**
    *   **Volley Attacks:** Bouncing lava fireball projectiles targeting player direction.
    *   **Minion Spawning:** Spawns charging Tiki minion helpers in Stages 2 & 3 that march towards the player and must be jumped on or shot.
*   **Invincibility Frames:** Boss is temporarily flashing and invulnerable for `40` frames after taking stomp damage (while still bouncing the player safely).

---

## 6. Level Design & ASCII Mapping
Levels are generated from ASCII grid strings in `game.js`:
*   `S` = Solid Wood Post Platform
*   `/` = Ramp Up (slope angle `1`)
*   `\` = Ramp Down (slope angle `-1`)
*   `~` = Gap Hazard (Level 1: Turquoise Ocean; Level 2: Jungle Floor/Canopy; Level 3: Volcanic Lava)
*   `?` = Question Blocks (Hit from below or shoot for `1000` points)
*   `^` = Vertical Elevator Platform
*   `*` = Tiki Spikes (Sea Urchin / Bamboo Spikes / Obsidian Magma Spikes)
*   `#` = Destructible Tiki Totem Barrier (2 HP)
*   `T` = Periodic Tiki Fire Jet Statue
*   `V` = Volcanic Steam Vent Launcher (Stage 3)
*   `P` / `C` = Pineapple (`200` pts) & Coconut (`100` pts) Collectibles
*   `B` = Stage Boss spawn point
*   `M` / `m` = Standard (`1` HP) & Armored (`2` HP) Minion spawn points
*   `1` = Player spawn position
*   `E` = End Goal / Stage Clear Line

### Stages Configuration
1.  **Stage 1 - Waikiki Sands:** Sandy shores, ocean jumps, Tiki post platforms. Boss: Giant Tiki Crab. Background: Parallax scroll with ocean waves.
2.  **Stage 2 - Waimea Canopy:** Dense tropical leaves, elevators, tall ramps. Boss: Giant Tiki Totem. Background: Parallax scroll with jungle foliage.
3.  **Stage 3 - Volcano Caldera:** Lava gaps, steam vents, obsidian spikes, fire jets. Boss: Pele's Fiery Guardian.

---

## 7. Project File Structure
*   [index.html](file:///c:/Users/derby/Documents/App%20Dev/OK%20Derby/index.html): Defines UI templates, glassmorphism panels, selectors, screens, and overlay structures.
*   [index.css](file:///c:/Users/derby/Documents/App%20Dev/OK%20Derby/index.css): Colors, layout variables, animations (hover effects, text pulse, float cycles), and parallax positioning.
*   [game.js](file:///c:/Users/derby/Documents/App%20Dev/OK%20Derby/game.js): Core game state machine, ASCII level load parses, physics loop, and collision handling.
*   [assets.js](file:///c:/Users/derby/Documents/App%20Dev/OK%20Derby/assets.js): Canvas rendering operations for vehicles, bosses, projectiles, particles, and decorations.
*   [audio.js](file:///c:/Users/derby/Documents/App%20Dev/OK%20Derby/audio.js): Synthesizer tone generator that handles loop timing for theme songs and individual sound effect triggers.
*   [README.md](file:///c:/Users/derby/Documents/App%20Dev/OK%20Derby/README.md): Quick-start user manual and default keyboard controls list.
