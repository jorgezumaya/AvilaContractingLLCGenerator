import { mergeApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';
import { App } from './app/app';

bootstrapApplication(App, mergeApplicationConfig(appConfig, {
  providers: [
    provideHttpClient(withFetch()),
    provideAuth0({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      authorizationParams: {
        redirect_uri: environment.auth0RedirectUri,
      },
    }),
  ],
})).catch((err) => console.error(err));
