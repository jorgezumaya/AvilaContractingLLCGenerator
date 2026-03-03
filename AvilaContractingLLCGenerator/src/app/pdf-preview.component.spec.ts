import { TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PdfPreviewComponent } from "./pdf-preview.component";
import { PreviewData } from "./models";
import { provideAnimations } from "@angular/platform-browser/animations";

const mockData: PreviewData = {
  docType: "Estimate",
  date: new Date(2026, 2, 2),
  clientName: "Waters Construction LLC",
  clientPhone: "817-555-1234",
  clientAddress: "Fort Worth, TX",
  addressWorked: "324 Cutler St",
  sections: [
    {
      name: "Master Bath",
      items: [
        { description: "Wall", sqFt: 127, totalAmount: 1397 },
        { description: "Floor", sqFt: 150, totalAmount: 1500 },
      ],
    },
  ],
  grandTotal: 2897,
};

const dialogRefStub = { close: vi.fn() };

describe("PdfPreviewComponent", () => {
  let component: PdfPreviewComponent;

  beforeEach(async () => {
    dialogRefStub.close.mockClear();

    await TestBed.configureTestingModule({
      imports: [PdfPreviewComponent],
      providers: [
        provideAnimations(),
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PdfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should expose the injected data", () => {
    expect(component.data.clientName).toBe("Waters Construction LLC");
    expect(component.data.grandTotal).toBe(2897);
  });

  it("close() should call dialogRef.close()", () => {
    component.close();
    expect(dialogRefStub.close).toHaveBeenCalled();
  });

  describe("buildFilename()", () => {
    it("combines address and date into a filename", () => {
      const name = component.buildFilename();
      expect(name).toContain("324CutlerSt");
      expect(name).toContain("03022026");
    });

    it("uses 'NoDate' when date is null", () => {
      component.data = { ...mockData, date: null };
      expect(component.buildFilename()).toContain("NoDate");
    });

    it("strips spaces and special chars from address", () => {
      component.data = { ...mockData, addressWorked: "324 Cutler St, #5" };
      const name = component.buildFilename();
      expect(name).not.toContain(" ");
      expect(name).not.toContain(",");
      expect(name).not.toContain("#");
    });
  });

  describe("formatCurrency()", () => {
    it("returns empty string for null", () => {
      expect(component.formatCurrency(null)).toBe("");
    });

    it("formats number as USD", () => {
      expect(component.formatCurrency(1397)).toBe("$1,397.00");
    });
  });

  describe("buildPrintHtml()", () => {
    it("includes the client name", () => {
      expect(component.buildPrintHtml()).toContain("Waters Construction LLC");
    });

    it("includes the doc type", () => {
      expect(component.buildPrintHtml()).toContain("Estimate");
    });

    it("includes each line item description", () => {
      const html = component.buildPrintHtml();
      expect(html).toContain("Wall");
      expect(html).toContain("Floor");
    });

    it("includes the grand total formatted as currency", () => {
      expect(component.buildPrintHtml()).toContain("$2,897.00");
    });

    it("includes a logo img tag when logoDataUrl is provided", () => {
      const html = component.buildPrintHtml("data:image/png;base64,abc123");
      expect(html).toContain('<img src="data:image/png;base64,abc123"');
    });

    it("omits logo img tag when logoDataUrl is empty", () => {
      expect(component.buildPrintHtml("")).not.toContain("<img");
    });
  });
});
