import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), provideAnimations()],
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

    it("renders the Open Generator CTA button", () => {
      expect(el.textContent).toContain("Open Generator");
    });

    it("renders the logo image with alt text", () => {
      const img = el.querySelector("img.hero-logo") as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.alt).toContain("Avila Contracting LLC");
    });
  });

  describe("feature cards", () => {
    it("renders Estimates card", () => {
      expect(el.textContent).toContain("Estimates");
    });

    it("renders Invoices card", () => {
      expect(el.textContent).toContain("Invoices");
    });

    it("renders PDF Export card", () => {
      expect(el.textContent).toContain("PDF Export");
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
