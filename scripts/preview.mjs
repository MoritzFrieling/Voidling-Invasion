import './build.mjs';

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const host = '127.0.0.1';
const port = 4173;
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
    const target = resolve(dist, `.${pathname === '/' ? '/index.html' : pathname}`);
    const insideDist = relative(dist, target);
    if (insideDist.startsWith('..') || isAbsolute(insideDist)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const content = await readFile(target);
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    }).end(content);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, host, () => {
  console.log(`Preview ready: http://${host}:${port}/`);
  console.log('Press Ctrl+C to stop. Run this command again after editing src/.');
});
