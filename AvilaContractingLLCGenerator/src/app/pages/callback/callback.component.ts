import { Component } from '@angular/core';

/**
 * Landing page for the Auth0 redirect_uri.
 * auth0-angular processes the ?code & ?state params automatically when
 * this component loads. AppComponent.ngOnInit then reads appState$.target
 * and navigates to the originally-requested route (e.g. /generator).
 */
@Component({
  selector: 'app-callback',
  standalone: true,
  template: `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#1a237e">
      <p>Completing sign in&hellip;</p>
    </div>
  `,
})
export class CallbackComponent {}
