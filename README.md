# OK Derby

Welcome to **OK Derby**, a browser-based Hawaiian Tiki vehicle platforming & racing adventure set across sandy beaches, lush jungle canopies, and volcanic calderas! Drive over wooden post platforms, boost over ocean and lava gaps, launch across ramps, outrace a sneaky Villain Competitor, and defeat island guardian bosses using your Coconut Bombs and Pineapple Bubbles!

## How to Play

1. Open `index.html` in any modern web browser (or visit your deployed GitHub Pages link).
2. Select your vehicle (**Aloha Cruiser**, **Surf Speeder**, or **Tiki Boom-Cart**) and choose your **Villain Difficulty** (`Easy`, `Medium`, or `Hard`).
3. Pick a stage (**Waikiki Sands**, **Waimea Canopy**, or **Volcano Caldera**), outrace the Villain Competitor, defeat the island boss, and reach the finish pipe!

## Controls

* **A / D** or **Left / Right Arrows**: Drive and accelerate
* **Space / W / Up Arrow**: Launch / Jump off ramps and platforms
* **W / S** or **Up / Down Arrows**: Fly Up / Down (during Lei Flight)
* **Shift**: Hold to Boost (x1.5 speed)
* **C or X**: Shoot Coconut Bombs
* **F or Z**: Shoot Pineapple Bubbles (high-arc projectile)
* **Q**: Deploy Rescue Board / Duck Boat (also auto-saves once per stage)
* **Esc**: Pause Game

## Mechanics

* **Ramps, Elevators & Gaps**: Build enough speed to jump over ocean, jungle canopy, and lava hazards, or ride elevators up to the high canopy tracks.
* **Tiki Obstacles**: Jump over Tiki Spikes (urchins, bamboo, obsidian), blast or climb Tiki Totems, and time your run past periodic Tiki Fire Jets.
* **Boss Fights**: Defeat each island's guardian boss (Giant Tiki Crab, Volcanic Tiki Totem, and Pele's Fiery Spirit) by shooting them or jumping on their heads!
* **I'iwi Bird Lei Flight**: Defeating a boss releases a caged scarlet honeycreeper bird that lifts your vehicle with a flower lei, granting 10 seconds of controllable flight.
* **Villain Competitor (Easy / Medium / Hard)**: A rival racer competes against you on all 3 stages! Instead of fighting normal enemies, the Villain glides over gaps and obstacles while dropping **Time-Bombs**, **Spiked Traps**, and **Rival Goons** behind them. Shoot or stomp the Villain to stun them, blast their traps and bombs out of your way, and beat them to the finish line for a bonus!

## Architecture

* `index.html` & `index.css`: UI screens, HUD, and glassmorphism styling
* `game.js`: Physics engine, driving logic, ASCII level loader, Villain AI, and entity updates
* `assets.js`: Canvas drawing functions for vehicles, villains, bosses, traps, ramps, and obstacles
* `audio.js`: Web Audio API synthesizer for sound effects and island music themes
* `qc.js`: Automated syntax, level-geometry, and gameplay verification suite (run with `node qc.js`)
* `game_spec.md`: Detailed game design & mechanics specification
