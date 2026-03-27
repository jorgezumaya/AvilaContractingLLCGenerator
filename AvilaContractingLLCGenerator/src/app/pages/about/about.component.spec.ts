import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { NgZone } from "@angular/core";
import { vi } from "vitest";
import { of } from "rxjs";
import { AboutComponent } from "./about.component";
import { MarketingService } from "../../services/marketing.service";
import { provideAnimations } from "@angular/platform-browser/animations";

const MARKETING_URLS = [
  "https://storage.example.com/marketing/banner_one.jpg",
  "https://storage.example.com/marketing/banner_two.jpg",
  "https://storage.example.com/marketing/banner_three.jpg",
];

const mockMarketingService = { getUrls: vi.fn(() => of(MARKETING_URLS)) };

describe("AboutComponent", () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    mockMarketingService.getUrls.mockReturnValue(of(MARKETING_URLS));

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        provideAnimations(),
        { provide: MarketingService, useValue: mockMarketingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => vi.clearAllMocks());

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

    it("email link has correct href with subject and body", () => {
      const link = el.querySelector('a[href*="mailto:"]') as HTMLAnchorElement;
      expect(link).toBeTruthy();
      expect(link.href).toContain("Avilacontractingllc4");
      expect(link.href).toContain("subject=");
      expect(link.href).toContain("body=");
    });

    it("phone link has correct href", () => {
      const link = el.querySelector('a[href^="tel:"]') as HTMLAnchorElement;
      expect(link).toBeTruthy();
      expect(link.href).toContain("984");
    });
  });

  describe("background slideshow", () => {
    it("loads URLs from MarketingService on init", () => {
      expect(mockMarketingService.getUrls).toHaveBeenCalledOnce();
      expect(component.bgUrls()).toEqual(MARKETING_URLS);
    });

    it("renders a bg-slide element for each URL", () => {
      fixture.detectChanges();
      const slides = el.querySelectorAll(".bg-slide");
      expect(slides.length).toBe(MARKETING_URLS.length);
    });

    it("starts with the first slide active", () => {
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(0);
      const slides = el.querySelectorAll(".bg-slide");
      expect(slides[0].classList).toContain("active");
    });

    it("renders the bg-overlay when images are present", () => {
      fixture.detectChanges();
      expect(el.querySelector(".bg-overlay")).toBeTruthy();
    });

    it("advances to the next slide after 2 seconds", fakeAsync(() => {
      TestBed.inject(NgZone).run(() => tick(2000));
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(1);
    }));

    it("wraps around to index 0 after cycling through all slides", fakeAsync(() => {
      TestBed.inject(NgZone).run(() => tick(2000 * MARKETING_URLS.length));
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(0);
    }));

    it("does not render the slideshow when no URLs are returned", async () => {
      mockMarketingService.getUrls.mockReturnValue(of([]));
      const f2 = TestBed.createComponent(AboutComponent);
      f2.detectChanges();
      expect(f2.nativeElement.querySelector(".bg-slideshow")).toBeNull();
      f2.destroy();
    });
  });
});
