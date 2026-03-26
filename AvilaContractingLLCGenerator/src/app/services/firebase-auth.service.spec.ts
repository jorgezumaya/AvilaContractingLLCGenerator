import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { BehaviorSubject, of } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';

const makeAuth0Mock = (authenticated: boolean, idToken = 'mock.id.token') => ({
  isLoading$: of(false),
  isAuthenticated$: new BehaviorSubject(authenticated),
  idTokenClaims$: of(authenticated ? { __raw: idToken } : null),
});

const mockFirebaseAuth = {} as Auth;
const mockHttp = { post: vi.fn(() => of({ firebaseToken: 'fb-custom-token' })) };

class TestFirebaseAuthService extends FirebaseAuthService {
  signInSpy = vi.fn().mockResolvedValue({ user: { uid: 'test-uid' } });
  signOutSpy = vi.fn().mockResolvedValue(undefined);

  protected override _signInWithCustomToken(token: string) {
    return this.signInSpy(token);
  }

  protected override _signOut() {
    return this.signOutSpy();
  }
}

describe('FirebaseAuthService', () => {
  let service: TestFirebaseAuthService;

  afterEach(() => vi.clearAllMocks());

  function setup(authenticated: boolean) {
    const auth0Mock = makeAuth0Mock(authenticated);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth0Mock },
        { provide: Auth, useValue: mockFirebaseAuth },
        { provide: HttpClient, useValue: mockHttp },
        { provide: FirebaseAuthService, useClass: TestFirebaseAuthService },
      ],
    });
    service = TestBed.inject(FirebaseAuthService) as TestFirebaseAuthService;
    return { auth0Mock };
  }

  it('should be created', () => {
    setup(false);
    expect(service).toBeTruthy();
  });

  describe('initialize() — authenticated user', () => {
    it('calls POST /api/firebase-token with the raw Auth0 ID token', () => {
      setup(true);
      service.initialize();
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/api/firebase-token',
        {},
        { headers: { Authorization: 'Bearer mock.id.token' } }
      );
    });

    it('calls _signInWithCustomToken with the returned Firebase token', () => {
      setup(true);
      service.initialize();
      expect(service.signInSpy).toHaveBeenCalledWith('fb-custom-token');
    });
  });

  describe('initialize() — unauthenticated user', () => {
    it('calls _signOut when Auth0 is not authenticated', () => {
      setup(false);
      service.initialize();
      expect(service.signOutSpy).toHaveBeenCalled();
    });

    it('does not call POST /api/firebase-token', () => {
      setup(false);
      service.initialize();
      expect(mockHttp.post).not.toHaveBeenCalled();
    });
  });

  describe('initialize() — SSR (non-browser)', () => {
    it('does nothing on the server platform', () => {
      const auth0Mock = makeAuth0Mock(true);
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: auth0Mock },
          { provide: Auth, useValue: mockFirebaseAuth },
          { provide: HttpClient, useValue: mockHttp },
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: FirebaseAuthService, useClass: TestFirebaseAuthService },
        ],
      });
      service = TestBed.inject(FirebaseAuthService) as TestFirebaseAuthService;
      service.initialize();
      expect(mockHttp.post).not.toHaveBeenCalled();
    });
  });
});
