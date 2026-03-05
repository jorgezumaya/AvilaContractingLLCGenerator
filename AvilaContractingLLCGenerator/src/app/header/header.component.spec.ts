import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { HeaderComponent } from "./header.component";
import { provideNativeDateAdapter } from "@angular/material/core";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideNativeDateAdapter()],
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

  describe("onDateInput()", () => {
    function makeEvent(value: string): Event {
      const input = document.createElement("input");
      input.value = value;
      return { target: input } as unknown as Event;
    }

    it("leaves 1-2 digits unchanged", () => {
      const ev = makeEvent("12");
      component.onDateInput(ev);
      expect((ev.target as HTMLInputElement).value).toBe("12");
    });

    it("inserts first slash after 2 digits", () => {
      const ev = makeEvent("123");
      component.onDateInput(ev);
      expect((ev.target as HTMLInputElement).value).toBe("12/3");
    });

    it("inserts second slash after 4 digits", () => {
      const ev = makeEvent("12/242");
      component.onDateInput(ev);
      expect((ev.target as HTMLInputElement).value).toBe("12/24/2");
    });

    it("formats a full 8-digit string correctly", () => {
      const ev = makeEvent("03042026");
      component.onDateInput(ev);
      expect((ev.target as HTMLInputElement).value).toBe("03/04/2026");
    });

    it("strips non-numeric characters", () => {
      const ev = makeEvent("ab12cd34ef2026");
      component.onDateInput(ev);
      expect((ev.target as HTMLInputElement).value).toBe("12/34/2026");
    });

    it("caps at 8 digits (10 chars with slashes)", () => {
      const ev = makeEvent("0304202699");
      component.onDateInput(ev);
      expect((ev.target as HTMLInputElement).value).toBe("03/04/2026");
    });
  });
});
