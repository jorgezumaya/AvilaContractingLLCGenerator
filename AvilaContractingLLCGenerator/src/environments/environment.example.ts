// Copy this file to environment.ts (dev) and environment.prod.ts (prod),
// then replace the placeholder values with your Auth0 credentials.
// See .env.example for the required variable names.
//
// NOTE: The client secret is NOT used here — this is a browser SPA.
// Only domain and clientId are needed. Both will be visible in the JS bundle.

export const environment = {
  production: false, // set to true in environment.prod.ts
  auth0Domain: 'YOUR_TENANT.us.auth0.com',
  auth0ClientId: 'YOUR_CLIENT_ID',
  auth0RedirectUri: 'http://localhost:4200', // use production URL in environment.prod.ts
};
