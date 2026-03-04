import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AboutComponent } from "./about.component";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("AboutComponent", () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("header", () => {
    it("renders the about heading", () => {
      expect(el.textContent).toContain("About Avila Contracting LLC");
    });

    it("renders the tagline", () => {
      expect(el.textContent).toContain("Professional Tile Installation");
    });

    it("renders the logo image", () => {
      const img = el.querySelector("img.about-logo") as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.alt).toContain("Avila Contracting LLC");
    });
  });

  describe("services list", () => {
    it("renders Floor Tile Installation", () => {
      expect(el.textContent).toContain("Floor Tile Installation");
    });

    it("renders Wall Tile Installation", () => {
      expect(el.textContent).toContain("Wall Tile Installation");
    });

    it("renders Shower & Tub Surrounds", () => {
      expect(el.textContent).toContain("Shower");
    });

    it("renders Niche & Custom Tile Work", () => {
      expect(el.textContent).toContain("Niche");
    });

    it("renders Floor Leveling", () => {
      expect(el.textContent).toContain("Floor Leveling");
    });
  });

  describe("contact card", () => {
    it("renders the business email", () => {
      expect(el.textContent).toContain("Avilacontractingllc4");
    });

    it("renders the business phone", () => {
      expect(el.textContent).toContain("984-202-6576");
    });

    it("renders the location", () => {
      expect(el.textContent).toContain("North Carolina");
    });

    it("email link has correct href", () => {
      const link = el.querySelector('a[href^="mailto:"]') as HTMLAnchorElement;
      expect(link).toBeTruthy();
      expect(link.href).toContain("Avilacontractingllc4");
    });

    it("phone link has correct href", () => {
      const link = el.querySelector('a[href^="tel:"]') as HTMLAnchorElement;
      expect(link).toBeTruthy();
      expect(link.href).toContain("984");
    });
  });
});
