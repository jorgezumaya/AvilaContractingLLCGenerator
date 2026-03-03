import { TestBed } from "@angular/core/testing";
import { DocumentService } from "./document.service";
import { RoomSection } from "./models";

describe("DocumentService", () => {
  let service: DocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("newItem()", () => {
    it("returns a blank LineItem", () => {
      const item = service.newItem();
      expect(item.description).toBe("");
      expect(item.sqFt).toBeNull();
      expect(item.totalAmount).toBeNull();
    });
  });

  describe("newSection()", () => {
    it("returns a section with one blank item", () => {
      const section = service.newSection();
      expect(section.name).toBe("");
      expect(section.items.length).toBe(1);
      expect(section.items[0].description).toBe("");
    });
  });

  describe("grandTotal()", () => {
    it("returns 0 for empty sections", () => {
      expect(service.grandTotal([])).toBe(0);
    });

    it("returns 0 when all totalAmounts are null", () => {
      const sections: RoomSection[] = [
        { name: "Master", items: [{ description: "Wall", sqFt: 100, totalAmount: null }] },
      ];
      expect(service.grandTotal(sections)).toBe(0);
    });

    it("sums totalAmounts across all sections and items", () => {
      const sections: RoomSection[] = [
        {
          name: "Master",
          items: [
            { description: "Wall", sqFt: 127, totalAmount: 1397 },
            { description: "Floor", sqFt: 150, totalAmount: 1500 },
          ],
        },
        {
          name: "Guest Bath",
          items: [{ description: "Wall", sqFt: 56, totalAmount: 616 }],
        },
      ];
      expect(service.grandTotal(sections)).toBe(3513);
    });

    it("treats null totalAmount as 0", () => {
      const sections: RoomSection[] = [
        {
          name: "Master",
          items: [
            { description: "Wall", sqFt: 100, totalAmount: 500 },
            { description: "Niche", sqFt: null, totalAmount: null },
          ],
        },
      ];
      expect(service.grandTotal(sections)).toBe(500);
    });
  });

  describe("formatCurrency()", () => {
    it("returns empty string for null", () => {
      expect(service.formatCurrency(null)).toBe("");
    });

    it("formats a number as USD currency", () => {
      expect(service.formatCurrency(1397)).toBe("$1,397.00");
    });

    it("formats zero correctly", () => {
      expect(service.formatCurrency(0)).toBe("$0.00");
    });
  });
});
