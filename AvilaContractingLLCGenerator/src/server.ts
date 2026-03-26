import 'dotenv/config';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

// ── Simple in-memory rate limiter for /api/firebase-token ──────────────────
// Limits each IP to 10 requests per 15-minute window.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function tokenRateLimit(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    next();
    return;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) {
    res.status(429).json({ error: 'Too many requests' });
    return;
  }
  next();
}

const angularApp = new AngularNodeAppEngine();

// ── Firebase Admin ─────────────────────────────────────────────────────────
if (!getApps().length) {
  const raw = process.env['FIREBASE_SERVICE_ACCOUNT'];
  if (raw) {
    initializeApp({ credential: cert(JSON.parse(raw)) });
  }
}

// ── Auth0 → Firebase token exchange ────────────────────────────────────────
// POST /api/firebase-token
// Authorization: Bearer <Auth0 ID token>
// Returns: { firebaseToken: string }
app.post('/api/firebase-token', tokenRateLimit, express.json({ limit: '10kb' }), async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const idToken = authHeader.slice(7);
  const domain = process.env['AUTH0_DOMAIN'];
  const clientId = process.env['AUTH0_CLIENT_ID'];

  if (!domain || !clientId) {
    res.status(500).json({ error: 'Server misconfigured' });
    return;
  }

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`https://${domain}/.well-known/jwks.json`)
    );

    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://${domain}/`,
      audience: clientId,
    });

    const uid = payload.sub as string;
    const firebaseToken = await getAuth().createCustomToken(uid);
    res.json({ firebaseToken });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// ── Static files ────────────────────────────────────────────────────────────
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// ── Angular SSR ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
