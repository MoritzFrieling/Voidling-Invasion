# Voidline Invasion

A dependency-free HTML5 Canvas arcade defense game. Pilot a combat ship through a three-sector campaign, stop enemy formations before they reach the Earth Gate, salvage resources for XP and credits, and build a stronger defense between encounters.

The campaign contains 21 compact stages across one-, two-, and three-lane maps, with two attack waves per stage. Later sectors add wormhole entry points, carriers with destructible interceptor wings, rocket-break shields, friendly defense stations, and three distinct command-ship encounters.

Completed sectors remain available from **Level Select** on the title screen. Each sector records a progression checkpoint when it is first unlocked; replaying or jumping to that sector restores that checkpoint's ship level, upgrades, hull, gate shields, and salvage credits, so upgrades earned in later sectors cannot overpower earlier runs.

## Run locally

Serve the `dist` directory with any static web server, then open `index.html` in a modern browser.

## Controls

- `WASD` — flight vector
- `Up Arrow` or left mouse — fire blaster
- `F` — charge and launch a heavy rocket
- `Q` — void boost
- `B` — build a defense station; press again while landed nearby to upgrade it
- `R` — call the next wave early after a fast, damage-free clear to earn bonus XP
- `Shift` — precision flight
- `Escape` — pause
- `L` — open Level Select from the title screen

Progress and settings are stored locally in the browser.

When no recent mouse or trackpad aiming is detected, the ship automatically faces the nearest hostile within short range. Remaining stationary for too long builds a static signature that modestly accelerates hostiles and their missile locks; movement clears the pressure.

## Acknowledgements

Gameplay was heavily inspired by Bloons Tower Defense, Kingdom Rush, and [SkyRush](https://marth1703.github.io/GameStudio/Skyrush/index.html), created by a friend of the developer.

## Publish on GitHub Pages

The repository includes a GitHub Actions workflow that publishes the contents of `dist` whenever `main` is pushed. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. The next push to `main` (or a manual run from the Actions tab) deploys the game.
