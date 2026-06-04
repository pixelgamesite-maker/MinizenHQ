import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from '../server/routes';
import { serveStatic, log } from '../server/vite';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

const server = createServer(app);

// Run setup once, outside the handler
const ready = (async () => {
  await registerRoutes(server, app);
  serveStatic(app);
})();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ready;
  return app(req, res);
}
