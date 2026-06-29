/**
 * Minimal static server + /api proxy for CI.
 *
 * Locally the frontend is served by nginx (frontend/nginx.conf), which proxies
 * /api -> backend:3001. In CI we don't run nginx, so this script reproduces the
 * same behaviour with zero extra dependencies: it serves the built SPA from
 * frontend/dist and forwards any /api/* request to the backend on :3001.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '../../frontend/dist');
const PORT = 3000;
const BACKEND = { host: 'localhost', port: 3001 };

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  // Proxy API calls to the backend, preserving method/headers/body.
  if (req.url.startsWith('/api')) {
    const proxyReq = http.request(
      { host: BACKEND.host, port: BACKEND.port, path: req.url, method: req.method, headers: req.headers },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
    proxyReq.on('error', () => { res.writeHead(502); res.end('Bad gateway'); });
    req.pipe(proxyReq);
    return;
  }

  // Serve static files; fall back to index.html for SPA client-side routes.
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`CI static+proxy server on http://localhost:${PORT} (/api -> :${BACKEND.port})`));
