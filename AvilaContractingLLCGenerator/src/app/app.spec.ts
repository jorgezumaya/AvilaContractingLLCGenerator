import { TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { of, EMPTY } from "rxjs";
import { App } from "./app";
import { BreakpointObserver } from "@angular/cdk/layout";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import { AuthService } from "@auth0/auth0-angular";
import { FirebaseAuthService } from './services/firebase-auth.service';

const mockBreakpointObserver = {
  observe: vi.fn(() => of({ matches: false, breakpoints: {} })),
};

const mockAuthService = {
  appState$: EMPTY,
};

describe("App (sidenav shell)", () => {
  let app: App;

  beforeEach(async () => {
    mockBreakpointObserver.observe.mockClear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideAnimations(),
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: AuthService, useValue: mockAuthService },
        { provide: FirebaseAuthService, useValue: { initialize: vi.fn() } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(app).toBeTruthy();
  });

  describe("initial signal state", () => {
    it("sidenavOpen starts true (desktop default)", () => {
      expect(app.sidenavOpen()).toBe(true);
    });

    it("sidebarCollapsed starts false", () => {
      expect(app.sidebarCollapsed()).toBe(false);
    });

    it("isMobile starts false (BreakpointObserver returns non-match)", () => {
      expect(app.isMobile()).toBe(false);
    });
  });

  describe("toggleSidenav() — desktop (isMobile=false)", () => {
    it("collapses the sidebar width on first call", () => {
      app.isMobile.set(false);
      app.toggleSidenav();
      expect(app.sidebarCollapsed()).toBe(true);
    });

    it("expands back on second call", () => {
      app.isMobile.set(false);
      app.toggleSidenav();
      app.toggleSidenav();
      expect(app.sidebarCollapsed()).toBe(false);
    });

    it("does not change sidenavOpen on desktop", () => {
      app.isMobile.set(false);
      app.sidenavOpen.set(true);
      app.toggleSidenav();
      expect(app.sidenavOpen()).toBe(true);
    });
  });

  describe("toggleSidenav() — mobile (isMobile=true)", () => {
    it("opens the drawer when it was closed", () => {
      app.isMobile.set(true);
      app.sidenavOpen.set(false);
      app.toggleSidenav();
      expect(app.sidenavOpen()).toBe(true);
    });

    it("closes the drawer when it was open", () => {
      app.isMobile.set(true);
      app.sidenavOpen.set(true);
      app.toggleSidenav();
      expect(app.sidenavOpen()).toBe(false);
    });

    it("does not change sidebarCollapsed on mobile", () => {
      app.isMobile.set(true);
      app.sidebarCollapsed.set(false);
      app.toggleSidenav();
      expect(app.sidebarCollapsed()).toBe(false);
    });
  });

  describe("closeSidenavIfMobile()", () => {
    it("closes sidenavOpen when isMobile=true", () => {
      app.isMobile.set(true);
      app.sidenavOpen.set(true);
      app.closeSidenavIfMobile();
      expect(app.sidenavOpen()).toBe(false);
    });

    it("leaves sidenavOpen unchanged when isMobile=false", () => {
      app.isMobile.set(false);
      app.sidenavOpen.set(true);
      app.closeSidenavIfMobile();
      expect(app.sidenavOpen()).toBe(true);
    });
  });

  describe("ngOnDestroy()", () => {
    it("unsubscribes without error", () => {
      expect(() => app.ngOnDestroy()).not.toThrow();
    });
  });
});
