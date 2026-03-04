#!/usr/bin/env bash
# Creates src/environments/environment.ts and environment.prod.ts from env vars.
# Usage: AUTH0_DOMAIN=... AUTH0_CLIENT_ID=... bash scripts/create-env-files.sh
set -euo pipefail

: "${AUTH0_DOMAIN:?AUTH0_DOMAIN environment variable is required}"
: "${AUTH0_CLIENT_ID:?AUTH0_CLIENT_ID environment variable is required}"

cat > src/environments/environment.ts << ENVEOF
export const environment = {
  production: false,
  auth0Domain: '${AUTH0_DOMAIN}',
  auth0ClientId: '${AUTH0_CLIENT_ID}',
  auth0RedirectUri: 'http://localhost:4200/callback',
};
ENVEOF

cat > src/environments/environment.prod.ts << ENVEOF
export const environment = {
  production: true,
  auth0Domain: '${AUTH0_DOMAIN}',
  auth0ClientId: '${AUTH0_CLIENT_ID}',
  auth0RedirectUri: 'https://jorgezumaya.github.io/AvilaContractingLLCGenerator/callback',
};
ENVEOF

echo "Environment files created."
