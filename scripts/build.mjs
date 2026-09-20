import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'src');
const dist = resolve(root, 'dist');

const gameSources = [
  'js/game/00-i18n.js',
  'js/game/01-config.js',
  'js/game/02-state.js',
  'js/game/03-progression.js',
  'js/game/04-account.js',
  'js/game/05-waves.js',
  'js/game/06-simulation.js',
  'js/game/07-upgrades.js',
  'js/game/08-render.js',
  'js/game/09-input.js',
  'js/game/10-bootstrap.js',
];

const cssSources = [
  'css/01-foundations.css',
  'css/02-hud.css',
  'css/03-overlays.css',
  'css/04-responsive.css',
];

async function concatenate(relativePaths) {
  const chunks = await Promise.all(relativePaths.map((relativePath) => readFile(resolve(src, relativePath), 'utf8')));
  return chunks.join('');
}

await mkdir(dist, { recursive: true });

const game = await concatenate(gameSources);
await writeFile(resolve(dist, 'game.js'), `(() => {\n  'use strict';\n\n${game}})();\n`, 'utf8');
await writeFile(resolve(dist, 'styles.css'), await concatenate(cssSources), 'utf8');
await copyFile(resolve(src, 'index.html'), resolve(dist, 'index.html'));
await copyFile(resolve(src, 'js/services/supabase-client.js'), resolve(dist, 'supabase-client.js'));
await copyFile(resolve(src, '.nojekyll'), resolve(dist, '.nojekyll'));

console.log(`Built ${gameSources.length} JavaScript modules and ${cssSources.length} CSS modules into dist/.`);
