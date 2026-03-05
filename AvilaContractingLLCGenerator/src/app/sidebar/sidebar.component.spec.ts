import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { of } from "rxjs";
import { SidebarComponent } from "./sidebar.component";
import { provideRouter } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";

const mockAuthService = {
  isAuthenticated$: of(false),
  user$: of(null),
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
};

const mockAuthServiceLoggedIn = {
  isAuthenticated$: of(true),
  user$: of({ name: 'Test User' }),
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
};

describe("SidebarComponent", () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
                { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("default (collapsed=false)", () => {
    it("shows the sidebar logo", () => {
      const logo = el.querySelector("img.sidebar-logo");
      expect(logo).toBeTruthy();
    });

    it("shows nav link text labels", () => {
      expect(el.textContent).toContain("Home");
      expect(el.textContent).toContain("About Us");
    });

    it("collapse button shows menu_open icon", () => {
      const icon = el.querySelector(".collapse-btn mat-icon");
      expect(icon?.textContent?.trim()).toBe("menu_open");
    });
  });

  describe("collapsed=true", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("collapsed", true);
      fixture.detectChanges();
    });

    it("hides the sidebar logo", () => {
      const logo = el.querySelector("img.sidebar-logo");
      expect(logo).toBeNull();
    });

    it("hides nav link text labels", () => {
      const titles = el.querySelectorAll("[matlistitemtitle]");
      expect(titles.length).toBe(0);
    });

    it("collapse button shows menu icon", () => {
      const icon = el.querySelector(".collapse-btn mat-icon");
      expect(icon?.textContent?.trim()).toBe("menu");
    });
  });

  describe("toggleCollapse output", () => {
    it("emits when collapse button is clicked", () => {
      const spy = vi.spyOn(component.toggleCollapse, "emit");
      const btn = el.querySelector(".collapse-btn") as HTMLElement;
      btn.click();
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("navigation links (unauthenticated)", () => {
    it("renders 2 nav links (no Generator)", () => {
      const links = el.querySelectorAll("a[mat-list-item]");
      expect(links.length).toBe(2);
    });

    it("Home link has aria-label", () => {
      const links = el.querySelectorAll("a[mat-list-item]");
      const homeLink = Array.from(links).find(l =>
        l.getAttribute("aria-label")?.toLowerCase().includes("home")
      );
      expect(homeLink).toBeTruthy();
    });

    it("About Us link has aria-label", () => {
      const links = el.querySelectorAll("a[mat-list-item]");
      const aboutLink = Array.from(links).find(l =>
        l.getAttribute("aria-label")?.toLowerCase().includes("about")
      );
      expect(aboutLink).toBeTruthy();
    });

    it("Generator link is hidden", () => {
      const links = el.querySelectorAll("a[mat-list-item]");
      const genLink = Array.from(links).find(l =>
        l.getAttribute("aria-label")?.toLowerCase().includes("generator")
      );
      expect(genLink).toBeUndefined();
    });
  });

  describe("navigation links (authenticated)", () => {
    let authEl: HTMLElement;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [SidebarComponent],
        providers: [
          provideRouter([]),
                    { provide: AuthService, useValue: mockAuthServiceLoggedIn },
        ],
      }).compileComponents();
      const authFixture = TestBed.createComponent(SidebarComponent);
      authFixture.detectChanges();
      authEl = authFixture.nativeElement as HTMLElement;
    });

    it("renders 3 nav links including Generator", () => {
      const links = authEl.querySelectorAll("a[mat-list-item]");
      expect(links.length).toBe(3);
    });

    it("Generator link has aria-label", () => {
      const links = authEl.querySelectorAll("a[mat-list-item]");
      const genLink = Array.from(links).find(l =>
        l.getAttribute("aria-label")?.toLowerCase().includes("generator")
      );
      expect(genLink).toBeTruthy();
    });
  });
});
