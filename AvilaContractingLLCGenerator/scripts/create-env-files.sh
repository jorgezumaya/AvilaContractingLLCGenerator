#!/usr/bin/env bash
# Creates src/environments/environment.ts and environment.prod.ts from env vars.
# Usage: AUTH0_DOMAIN=... AUTH0_CLIENT_ID=... FIREBASE_API_KEY=... bash scripts/create-env-files.sh
set -euo pipefail

: "${AUTH0_DOMAIN:?AUTH0_DOMAIN environment variable is required}"
: "${AUTH0_CLIENT_ID:?AUTH0_CLIENT_ID environment variable is required}"
: "${FIREBASE_API_KEY:?FIREBASE_API_KEY environment variable is required}"
: "${FIREBASE_AUTH_DOMAIN:?FIREBASE_AUTH_DOMAIN environment variable is required}"
: "${FIREBASE_PROJECT_ID:?FIREBASE_PROJECT_ID environment variable is required}"
: "${FIREBASE_STORAGE_BUCKET:?FIREBASE_STORAGE_BUCKET environment variable is required}"
: "${FIREBASE_MESSAGING_SENDER_ID:?FIREBASE_MESSAGING_SENDER_ID environment variable is required}"
: "${FIREBASE_APP_ID:?FIREBASE_APP_ID environment variable is required}"

cat > src/environments/environment.ts << ENVEOF
export const environment = {
  production: false,
  auth0Domain: '${AUTH0_DOMAIN}',
  auth0ClientId: '${AUTH0_CLIENT_ID}',
  auth0RedirectUri: 'http://localhost:4200/callback',
  firebaseConfig: {
    apiKey: '${FIREBASE_API_KEY}',
    authDomain: '${FIREBASE_AUTH_DOMAIN}',
    projectId: '${FIREBASE_PROJECT_ID}',
    storageBucket: '${FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${FIREBASE_APP_ID}',
  },
};
ENVEOF

cat > src/environments/environment.prod.ts << ENVEOF
export const environment = {
  production: true,
  auth0Domain: '${AUTH0_DOMAIN}',
  auth0ClientId: '${AUTH0_CLIENT_ID}',
  auth0RedirectUri: 'https://avila-contracting-llc.web.app/callback',
  firebaseConfig: {
    apiKey: '${FIREBASE_API_KEY}',
    authDomain: '${FIREBASE_AUTH_DOMAIN}',
    projectId: '${FIREBASE_PROJECT_ID}',
    storageBucket: '${FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${FIREBASE_APP_ID}',
  },
};
ENVEOF

echo "Environment files created."
