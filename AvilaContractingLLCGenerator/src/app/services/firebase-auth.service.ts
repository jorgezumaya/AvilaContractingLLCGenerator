import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Auth, signInWithCustomToken, signOut } from '@angular/fire/auth';
import { AuthService } from '@auth0/auth0-angular';
import { filter, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private auth0 = inject(AuthService);
  private firebaseAuth = inject(Auth);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.auth0.isLoading$.pipe(
      tap(loading => console.log('[FBAuth] isLoading$:', loading)),
      filter(loading => !loading),
      switchMap(() => this.auth0.idTokenClaims$),
      tap(claims => console.log('[FBAuth] idTokenClaims$:', claims)),
      filter(Boolean),
      switchMap(claims =>
        this.http.post<{ firebaseToken: string }>(
          '/api/firebase-token',
          {},
          { headers: { Authorization: `Bearer ${claims['__raw']}` } }
        ).pipe(
          tap(res => console.log('[FBAuth] /api/firebase-token response:', res)),
        )
      ),
      switchMap(({ firebaseToken }) =>
        signInWithCustomToken(this.firebaseAuth, firebaseToken)
      ),
      tap(cred => console.log('[FBAuth] Firebase signed in:', cred.user?.uid)),
    ).subscribe({
      error: err => console.error('[FBAuth] FAILED:', err),
    });

    this.auth0.isAuthenticated$.pipe(
      filter(authenticated => !authenticated),
      switchMap(() => signOut(this.firebaseAuth)),
    ).subscribe();
  }
}
