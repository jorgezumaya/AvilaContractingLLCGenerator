import { TestBed, ComponentFixture } from "@angular/core/testing";
import { vi } from "vitest";
import { of } from "rxjs";
import { GeneratorComponent } from "./generator.component";
import { MatDialog } from "@angular/material/dialog";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { Status } from "../../models/models";
import { ContactsService } from "../../services/contacts.service";

const dialogSpy = { open: vi.fn() };
const mockContactsService = { getAll: vi.fn().mockReturnValue(of([])) };

describe("GeneratorComponent", () => {
  let component: GeneratorComponent;
  let fixture: ComponentFixture<GeneratorComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    dialogSpy.open.mockClear();

    await TestBed.configureTestingModule({
      imports: [GeneratorComponent],
      providers: [
        provideRouter([]),
        provideNativeDateAdapter(),
        provideAnimations(),
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ContactsService, useValue: mockContactsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("feature cards", () => {
    it("renders the Estimates card", () => {
      expect(el.textContent).toContain("Estimates");
    });

    it("renders the Invoices card", () => {
      expect(el.textContent).toContain("Invoices");
    });

    it("renders the PDF Export card", () => {
      expect(el.textContent).toContain("PDF Export");
    });

    it("renders three feature card items", () => {
      const items = el.querySelectorAll(".gen-feature-item");
      expect(items.length).toBe(3);
    });

    it("renders mobile labels for each feature", () => {
      const labels = el.querySelectorAll(".gen-feature-mobile-label");
      expect(labels.length).toBe(3);
    });

    it("renders three mobile description elements", () => {
      const descs = el.querySelectorAll(".gen-feature-mobile-desc");
      expect(descs.length).toBe(3);
    });
  });

  describe("toggleFeature()", () => {
    it("starts with no active feature", () => {
      expect(component.activeFeature()).toBeNull();
    });

    it("sets the active feature on first call", () => {
      component.toggleFeature("estimates");
      expect(component.activeFeature()).toBe("estimates");
    });

    it("clears the active feature when called again with the same name", () => {
      component.toggleFeature("estimates");
      component.toggleFeature("estimates");
      expect(component.activeFeature()).toBeNull();
    });

    it("switches to a different feature without needing to deactivate first", () => {
      component.toggleFeature("invoices");
      component.toggleFeature("pdf");
      expect(component.activeFeature()).toBe("pdf");
    });

    it("adds .active class to the clicked card in the DOM", () => {
      component.toggleFeature("estimates");
      fixture.detectChanges();
      const cards = el.querySelectorAll(".gen-feature-card");
      expect(cards[0].classList).toContain("active");
      expect(cards[1].classList).not.toContain("active");
      expect(cards[2].classList).not.toContain("active");
    });

    it("adds .visible class to the matching mobile desc", () => {
      component.toggleFeature("invoices");
      fixture.detectChanges();
      const descs = el.querySelectorAll(".gen-feature-mobile-desc");
      expect(descs[1].classList).toContain("visible");
      expect(descs[0].classList).not.toContain("visible");
      expect(descs[2].classList).not.toContain("visible");
    });

    it("removes .visible class when the same feature is toggled off", () => {
      component.toggleFeature("pdf");
      fixture.detectChanges();
      component.toggleFeature("pdf");
      fixture.detectChanges();
      const descs = el.querySelectorAll(".gen-feature-mobile-desc");
      descs.forEach((d) => expect(d.classList).not.toContain("visible"));
    });
  });

  describe("EorI signal", () => {
    it("starts as Estimate", () => {
      expect(component.EorI()).toBe(Status.E);
    });
  });

  describe("toggleEorI()", () => {
    it("toggles to Invoice", () => {
      component.toggleEorI();
      expect(component.EorI()).toBe(Status.I);
    });

    it("toggles back to Estimate on second call", () => {
      component.toggleEorI();
      component.toggleEorI();
      expect(component.EorI()).toBe(Status.E);
    });
  });

  describe("grandTotal()", () => {
    it("returns 0 with default empty sections", () => {
      expect(component.grandTotal()).toBe(0);
    });

    it("sums all section item totals", () => {
      component.sections = [
        { name: "Master", items: [{ description: "Wall", sqFt: 100, totalAmount: 1000 }] },
        { name: "Guest", items: [{ description: "Floor", sqFt: 50, totalAmount: 500 }] },
      ];
      expect(component.grandTotal()).toBe(1500);
    });

    it("treats null totalAmount as 0", () => {
      component.sections = [
        { name: "Bath", items: [{ description: "Niche", sqFt: null, totalAmount: null }] },
      ];
      expect(component.grandTotal()).toBe(0);
    });
  });

  describe("openPreview()", () => {
    it("calls dialog.open with correct PreviewData", () => {
      component.clientInfo = {
        name: "Waters Construction LLC",
        phone: "817-555-1234",
        address: "Fort Worth, TX",
        addressWorked: "324 Cutler St",
      };
      component.selectedDate.set(new Date(2026, 2, 2));
      component.sections = [
        { name: "Master", items: [{ description: "Wall", sqFt: 127, totalAmount: 1397 }] },
      ];

      component.openPreview();

      expect(dialogSpy.open).toHaveBeenCalled();
      const [, config] = dialogSpy.open.mock.calls.at(-1)!;
      expect(config.data.clientName).toBe("Waters Construction LLC");
      expect(config.data.addressWorked).toBe("324 Cutler St");
      expect(config.data.grandTotal).toBe(1397);
      expect(config.data.docType).toBe(Status.E);
    });

    it("passes the currently selected date to the dialog", () => {
      const date = new Date(2026, 5, 15);
      component.selectedDate.set(date);
      component.openPreview();
      const [, config] = dialogSpy.open.mock.calls.at(-1)!;
      expect(config.data.date).toBe(date);
    });

    it("passes the current docType (Invoice) when toggled", () => {
      component.toggleEorI();
      component.openPreview();
      const [, config] = dialogSpy.open.mock.calls.at(-1)!;
      expect(config.data.docType).toBe(Status.I);
    });
  });
});
