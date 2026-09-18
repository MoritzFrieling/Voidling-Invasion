# Supabase setup for Voidline Invasion

The browser integration is already configured for project `vwmqichhpmikufwqofpn`. The publishable key in `dist/supabase-client.js` is intentionally public and is restricted by Row Level Security. Never add the database password, a secret key, or a `service_role` key to this repository.

## One-time project setup

1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/vwmqichhpmikufwqofpn/sql/new).
2. Copy all of `supabase/migrations/001_voidline_cloud.sql` into a new query and run it once.
3. Open **Authentication → Providers → Anonymous Sign-Ins** and enable anonymous sign-ins.
4. Keep the **Email** provider enabled, but disable **Confirm email**. The game uses an internal email-shaped identifier behind each username because Supabase password authentication does not natively support usernames. No player enters or receives email.
5. In **Settings → API → Data API**, keep the Data API enabled. It is fine—and preferable—to leave automatic exposure/default privileges disabled: the migration grants only the exact table and function permissions the game needs.

## Admin pilot

The admin account is a normal permanent Supabase Auth account; its password is never stored in the repository. Run `supabase/migrations/002_voidline_admin.sql` once to add the admin flag column, create the account through the game's **CREATE ACCOUNT** flow with the username `admin` and the password you want to use, then run the same migration again to mark that account as admin.

The admin pilot receives access to every level, but admin runs are excluded from the high-score table and their saved high score is forced to zero. Do not use a guest account named `admin`.

The migration explicitly enables RLS on every game table. The **automatic RLS** project setting can remain enabled as additional protection for future tables.

## What gets stored

- `profiles`: unique public pilot names and whether a pilot is a guest.
- `game_saves`: one private campaign save per user and game.
- `leaderboard_scores`: only the best result for each pilot.
- `account_upgrades`: short-lived transfer tokens used when a guest protects progress with a password.

Passwords and sessions remain entirely inside Supabase Auth. They are never written to the game tables.

## Security notes

- Guests and password accounts receive real Supabase Auth user IDs.
- A player can only read and update their own save through RLS.
- Leaderboard writes go through `submit_voidline_score`; direct browser writes are revoked.
- The leaderboard returns only usernames, guest status, and game statistics—not user IDs.
- Client-side games cannot fully prevent fabricated scores. Add server-side run verification before treating the leaderboard as competitive or awarding anything valuable.
- Before a public launch, add Cloudflare Turnstile or hCaptcha to guest creation and account creation, then pass its token to the Supabase Auth calls.

## Moving to a self-hosted Supabase later

Restore the managed database into the self-hosted instance, apply any missing migrations, then change only `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` at the top of `dist/supabase-client.js`. Existing users will need to sign in again because the new instance uses different session-signing keys.
