import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { of } from "rxjs";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { ClientInfoComponent } from "./client-info.component";
import { ClientInfo, Contact } from "../models/models";
import { ContactsService } from "../services/contacts.service";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

const CONTACTS: Contact[] = [
  { id: '1', name: 'Waters Construction LLC', phone: '817-822-5200', address: 'Fort Worth, TX' },
  { id: '2', name: 'Smith Builders', phone: '214-555-0100', address: 'Dallas, TX' },
];

const mockContactsService = {
  getAll: vi.fn().mockReturnValue(of(CONTACTS)),
};

describe("ClientInfoComponent", () => {
  let component: ClientInfoComponent;
  let fixture: ComponentFixture<ClientInfoComponent>;
  let info: ClientInfo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientInfoComponent],
      providers: [
        provideNoopAnimations(),
        { provide: ContactsService, useValue: mockContactsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientInfoComponent);
    component = fixture.componentInstance;
    info = { name: "", phone: "", address: "", addressWorked: "" };
    component.info = info;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render four form fields", () => {
    const fields = fixture.nativeElement.querySelectorAll("mat-form-field");
    expect(fields.length).toBe(4);
  });

  it("should bind ngModel to info.name", async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      "input[placeholder='e.g. Waters Construction LLC']"
    );
    expect(input).toBeTruthy();
    input.value = "Waters Construction LLC";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.info.name).toBe("Waters Construction LLC");
  });

  it("should bind ngModel to info.phone", async () => {
    // Phone is the 2nd mat-form-field (index 1)
    const fields = fixture.nativeElement.querySelectorAll("mat-form-field");
    const input = fields[1].querySelector("input") as HTMLInputElement;
    expect(input).toBeTruthy();
    input.value = "817-555-1234";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.info.phone).toBe("817-555-1234");
  });

  describe("autocomplete", () => {
    it("onNameInput() updates nameQuery signal", () => {
      component.onNameInput("waters");
      expect(component.nameQuery()).toBe("waters");
    });

    it("filteredContacts() returns all when query is empty", () => {
      component.onNameInput("");
      expect(component.filteredContacts().length).toBe(CONTACTS.length);
    });

    it("filteredContacts() filters by name (case-insensitive)", () => {
      component.onNameInput("smith");
      const filtered = component.filteredContacts();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe("Smith Builders");
    });

    it("onContactSelected() autofills phone and address", () => {
      component.info = { name: "Waters Construction LLC", phone: "", address: "", addressWorked: "" };
      const fakeEvent = {
        option: { value: "Waters Construction LLC" },
      } as MatAutocompleteSelectedEvent;
      component.onContactSelected(fakeEvent);
      expect(component.info.phone).toBe("817-822-5200");
      expect(component.info.address).toBe("Fort Worth, TX");
    });

    it("onContactSelected() does nothing when name not found", () => {
      component.info = { name: "Unknown", phone: "old-phone", address: "old-addr", addressWorked: "" };
      const fakeEvent = {
        option: { value: "Unknown Client XYZ" },
      } as MatAutocompleteSelectedEvent;
      component.onContactSelected(fakeEvent);
      expect(component.info.phone).toBe("old-phone");
      expect(component.info.address).toBe("old-addr");
    });
  });
});
