import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { HeaderComponent } from "./header.component";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideNativeDateAdapter(), provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.docType = "Estimate";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display the docType label in the toggle", () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain("Estimate");
  });

  it("should emit docTypeToggle when called", () => {
    const spy = vi.spyOn(component.docTypeToggle, "emit");
    component.docTypeToggle.emit();
    expect(spy).toHaveBeenCalled();
  });

  it("should start with date as null", () => {
    expect(component.date).toBeNull();
  });

  it("should update date and emit selectedDateChange on onDateChange()", () => {
    const spy = vi.spyOn(component.selectedDateChange, "emit");
    const testDate = new Date(2026, 2, 2);
    component.onDateChange(testDate);
    expect(component.date).toEqual(testDate);
    expect(spy).toHaveBeenCalledWith(testDate);
  });

  it("should emit null when date is cleared", () => {
    const spy = vi.spyOn(component.selectedDateChange, "emit");
    component.onDateChange(null);
    expect(component.date).toBeNull();
    expect(spy).toHaveBeenCalledWith(null);
  });
});
