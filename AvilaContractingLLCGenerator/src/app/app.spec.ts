import { TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { App } from "./app";
import { MatDialog } from "@angular/material/dialog";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { Status } from "./models/models";

const dialogSpy = { open: vi.fn() };

describe("App", () => {
  let app: App;

  beforeEach(async () => {
    dialogSpy.open.mockClear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideNativeDateAdapter(),
        provideAnimations(),
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(app).toBeTruthy();
  });

  describe("toggleEorI()", () => {
    it("starts as Estimate", () => {
      expect(app.EorI()).toBe(Status.E);
    });

    it("toggles to Invoice", () => {
      app.toggleEorI();
      expect(app.EorI()).toBe(Status.I);
    });

    it("toggles back to Estimate on second call", () => {
      app.toggleEorI();
      app.toggleEorI();
      expect(app.EorI()).toBe(Status.E);
    });
  });

  describe("grandTotal()", () => {
    it("returns 0 with default empty sections", () => {
      expect(app.grandTotal()).toBe(0);
    });

    it("sums all section item totals", () => {
      app.sections = [
        { name: "Master", items: [{ description: "Wall", sqFt: 100, totalAmount: 1000 }] },
        { name: "Guest", items: [{ description: "Floor", sqFt: 50, totalAmount: 500 }] },
      ];
      expect(app.grandTotal()).toBe(1500);
    });
  });

  describe("openPreview()", () => {
    it("calls dialog.open with correct PreviewData", () => {
      app.clientInfo = {
        name: "Waters Construction LLC",
        phone: "817-555-1234",
        address: "Fort Worth, TX",
        addressWorked: "324 Cutler St",
      };
      app.selectedDate.set(new Date(2026, 2, 2));
      app.sections = [
        { name: "Master", items: [{ description: "Wall", sqFt: 127, totalAmount: 1397 }] },
      ];

      app.openPreview();

      expect(dialogSpy.open).toHaveBeenCalled();
      const [, config] = dialogSpy.open.mock.calls.at(-1)!;
      expect(config.data.clientName).toBe("Waters Construction LLC");
      expect(config.data.addressWorked).toBe("324 Cutler St");
      expect(config.data.grandTotal).toBe(1397);
      expect(config.data.docType).toBe(Status.E);
    });
  });
});
