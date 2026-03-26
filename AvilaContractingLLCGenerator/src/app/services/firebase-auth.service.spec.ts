import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { vi } from 'vitest';
import { BehaviorSubject, of } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import * as firebaseAuth from '@angular/fire/auth';

const makeAuth0Mock = (authenticated: boolean, idToken = 'mock.id.token') => ({
  isLoading$: of(false),
  isAuthenticated$: new BehaviorSubject(authenticated),
  idTokenClaims$: of(authenticated ? { __raw: idToken } : null),
});

const mockFirebaseAuth = {} as Auth;
const mockHttp = { post: vi.fn(() => of({ firebaseToken: 'fb-custom-token' })) };

describe('FirebaseAuthService', () => {
  let service: FirebaseAuthService;

  beforeEach(() => {
    vi.spyOn(firebaseAuth, 'signInWithCustomToken').mockResolvedValue({} as any);
    vi.spyOn(firebaseAuth, 'signOut').mockResolvedValue();
  });

  afterEach(() => vi.clearAllMocks());

  function setup(authenticated: boolean) {
    const auth0Mock = makeAuth0Mock(authenticated);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth0Mock },
        { provide: Auth, useValue: mockFirebaseAuth },
        { provide: HttpClient, useValue: mockHttp },
      ],
    });
    service = TestBed.inject(FirebaseAuthService);
    return { auth0Mock };
  }

  it('should be created', () => {
    setup(false);
    expect(service).toBeTruthy();
  });

  describe('initialize() — authenticated user', () => {
    it('calls POST /api/firebase-token with the raw Auth0 ID token', fakeAsync(() => {
      setup(true);
      service.initialize();
      tick();
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/api/firebase-token',
        {},
        { headers: { Authorization: 'Bearer mock.id.token' } }
      );
    }));

    it('calls signInWithCustomToken with the returned Firebase token', fakeAsync(() => {
      setup(true);
      service.initialize();
      tick();
      expect(firebaseAuth.signInWithCustomToken).toHaveBeenCalledWith(
        mockFirebaseAuth,
        'fb-custom-token'
      );
    }));
  });

  describe('initialize() — unauthenticated user', () => {
    it('calls signOut when Auth0 is not authenticated', fakeAsync(() => {
      setup(false);
      service.initialize();
      tick();
      expect(firebaseAuth.signOut).toHaveBeenCalledWith(mockFirebaseAuth);
    }));

    it('does not call POST /api/firebase-token', fakeAsync(() => {
      setup(false);
      service.initialize();
      tick();
      expect(mockHttp.post).not.toHaveBeenCalled();
    }));
  });

  describe('initialize() — SSR (non-browser)', () => {
    it('does nothing on the server platform', () => {
      const auth0Mock = makeAuth0Mock(true);
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: auth0Mock },
          { provide: Auth, useValue: mockFirebaseAuth },
          { provide: HttpClient, useValue: mockHttp },
          // Simulate server platform
          { provide: 'PLATFORM_ID', useValue: 'server' },
        ],
      });
      service = TestBed.inject(FirebaseAuthService);
      service.initialize();
      expect(mockHttp.post).not.toHaveBeenCalled();
    });
  });
});
