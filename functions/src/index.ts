import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createRemoteJWKSet, jwtVerify } from 'jose';

if (!getApps().length) {
  initializeApp();
}

const auth0Domain = defineSecret('AUTH0_DOMAIN');
const auth0ClientId = defineSecret('AUTH0_CLIENT_ID');

// Auth0 → Firebase custom token exchange.
// Called by FirebaseAuthService after Auth0 login.
// Firebase Hosting rewrites /api/firebase-token → this function.
export const firebaseToken = onRequest(
  { secrets: [auth0Domain, auth0ClientId] },
  async (req, res) => {
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
    const domain = auth0Domain.value();
    const clientId = auth0ClientId.value();

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
  }
);
