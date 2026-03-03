import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineItemsComponent } from "./line-items.component";
import { RoomSection } from "../models";
import { provideAnimations } from "@angular/platform-browser/animations";

function makeSection(name = "Master"): RoomSection {
  return {
    name,
    items: [{ description: "Wall", sqFt: 100, totalAmount: 1000 }],
  };
}

describe("LineItemsComponent", () => {
  let component: LineItemsComponent;
  let fixture: ComponentFixture<LineItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineItemsComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(LineItemsComponent);
    component = fixture.componentInstance;
    component.sections = [makeSection()];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("addSection()", () => {
    it("adds a new blank section", () => {
      component.addSection();
      expect(component.sections.length).toBe(2);
    });

    it("new section has one blank item", () => {
      component.addSection();
      const newSection = component.sections[1];
      expect(newSection.items.length).toBe(1);
      expect(newSection.items[0].description).toBe("");
    });
  });

  describe("removeSection()", () => {
    it("removes the section at the given index", () => {
      component.sections = [makeSection("Master"), makeSection("Guest")];
      component.removeSection(0);
      expect(component.sections.length).toBe(1);
      expect(component.sections[0].name).toBe("Guest");
    });
  });

  describe("addItem()", () => {
    it("adds a blank item to the specified section", () => {
      component.addItem(0);
      expect(component.sections[0].items.length).toBe(2);
      expect(component.sections[0].items[1].description).toBe("");
    });
  });

  describe("removeItem()", () => {
    it("removes the item at the given index from the specified section", () => {
      component.sections[0].items.push({ description: "Floor", sqFt: 50, totalAmount: 500 });
      component.removeItem(0, 0);
      expect(component.sections[0].items.length).toBe(1);
      expect(component.sections[0].items[0].description).toBe("Floor");
    });
  });
});
