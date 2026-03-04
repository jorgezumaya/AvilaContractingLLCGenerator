import { TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { GeneratorComponent } from "./generator.component";
import { MatDialog } from "@angular/material/dialog";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { Status } from "../../models/models";

const dialogSpy = { open: vi.fn() };

describe("GeneratorComponent", () => {
  let component: GeneratorComponent;

  beforeEach(async () => {
    dialogSpy.open.mockClear();

    await TestBed.configureTestingModule({
      imports: [GeneratorComponent],
      providers: [
        provideRouter([]),
        provideNativeDateAdapter(),
        provideAnimations(),
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(GeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
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
