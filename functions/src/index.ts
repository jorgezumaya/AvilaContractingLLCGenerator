import * as functions from 'firebase-functions';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createRemoteJWKSet, jwtVerify } from 'jose';

if (!getApps().length) {
  initializeApp();
}

// Auth0 → Firebase custom token exchange.
// Called by FirebaseAuthService after Auth0 login.
// Firebase Hosting rewrites /api/firebase-token → this function.
export const firebaseToken = functions
  .runWith({ secrets: ['AUTH0_DOMAIN', 'AUTH0_CLIENT_ID'] })
  .https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
    const token = await getAuth().createCustomToken(uid);
    res.json({ firebaseToken: token });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
