# Voidline Invasion

A dependency-free HTML5 Canvas arcade defense game. Pilot a combat ship through a four-sector campaign, stop enemy formations before they reach the objective, salvage resources for XP and credits, and build a stronger defense between encounters.

The campaign contains 29 stages across one-, two-, and three-lane maps, with two attack waves per stage. Sectors 1–3 defend the Earth Gate. Sector 4 protects an outer-space station construction site across a larger map with three distant approaches, gravity anchors, repair vessels, and the Lagrange Warden. Defense stations can specialize on their first upgrade as interceptor arrays, siege cannons, or slowing defense networks.

Completed sectors remain available from **Level Select** on the title screen. Each sector records a progression checkpoint when it is first unlocked; replaying or jumping to that sector restores that checkpoint's ship level, upgrades, hull, gate shields, and salvage credits, so upgrades earned in later sectors cannot overpower earlier runs.

## Run locally

From the project directory, run:

```bash
node scripts/preview.mjs
```

Open **http://127.0.0.1:4173/** in your browser. The command builds and serves the current local version, so you can play it before pushing. Leave the command running while you play; press `Ctrl+C` to stop it. After editing `src/`, restart the command and refresh the page to see the changes. Opening `src/index.html` as a `file://` URL skips the build, so its CSS and JavaScript links do not resolve.

## Controls

- `WASD` — flight vector
- `Up Arrow` or left mouse — fire blaster
- `F` — charge and launch a heavy rocket
- `T` — place or replace the single void-jump destination (short placement cooldown)
- `Q` or right mouse — teleport to the placed void-jump destination
- `B` — build a defense station; press again while landed nearby to upgrade it
- `R` — call the next wave early after a fast, damage-free clear to earn bonus XP
- `Shift` — precision flight
- `Escape` — pause
- `L` — open Level Select from the title screen

Players start with a generated callsign already filled in and can overwrite it before launching. Anonymous guest sessions keep progress on the device and synchronize to Supabase when available, without requiring an account or password. The admin control in the top-right opens the password-only testing console; administrator runs never submit highscores. Settings remain local to each browser.

The title screen also includes a cloud leaderboard. Each pilot contributes only their strongest run.

When no recent mouse or trackpad aiming is detected, the ship automatically faces the nearest hostile within short range. Remaining stationary for too long builds a static signature that modestly accelerates hostiles and their missile locks; movement clears the pressure.

## Source layout

The editable source lives in `src/`. JavaScript is split into ordered game modules under `src/js/game/`, with the Supabase adapter in `src/js/services/`. Styles are grouped under `src/css/`, while `src/index.html` contains the page shell. `scripts/build.mjs` assembles these source files into the deployable `dist/` bundle; edit `src/` and rebuild instead of editing generated files directly.

## Acknowledgements

Gameplay was heavily inspired by Bloons Tower Defense, Kingdom Rush, and [SkyRush](https://marth1703.github.io/GameStudio/Skyrush/index.html), created by a friend of the developer.

## Publish on GitHub Pages

The repository includes a GitHub Actions workflow that publishes the contents of `dist` whenever `main` is pushed. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. The next push to `main` (or a manual run from the Actions tab) deploys the game.

## Supabase

Before account access works, complete the one-time steps in [SUPABASE_SETUP.md](SUPABASE_SETUP.md). The repository contains the complete RLS-protected schema at `supabase/migrations/001_voidline_cloud.sql`.
