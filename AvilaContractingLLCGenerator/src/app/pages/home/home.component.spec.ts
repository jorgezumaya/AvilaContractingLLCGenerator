import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { of } from "rxjs";
import { HomeComponent } from "./home.component";
import { provideAnimations } from "@angular/platform-browser/animations";
import { JobsService } from "../../services/jobs.service";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideAnimations(),
        { provide: JobsService, useValue: { getAll: vi.fn(() => of([])) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("hero section", () => {
    it("renders the company hero title", () => {
      expect(el.textContent).toContain("Avila Contracting LLC");
    });

    it("renders the hero subtitle", () => {
      expect(el.textContent).toContain("Professional Tile Installation");
    });

    it("does not render the Open Generator button", () => {
      expect(el.textContent).not.toContain("Open Generator");
    });

    it("renders the logo image with alt text", () => {
      const img = el.querySelector("img.hero-logo") as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.alt).toContain("Avila Contracting LLC");
    });
  });

  describe("contact strip", () => {
    it("renders the business email", () => {
      expect(el.textContent).toContain("Avilacontractingllc4");
    });

    it("renders the business phone", () => {
      expect(el.textContent).toContain("984-202-6576");
    });
  });
});
