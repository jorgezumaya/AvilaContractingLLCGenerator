import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ClientInfoComponent } from "./client-info.component";
import { ClientInfo } from "../models";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("ClientInfoComponent", () => {
  let component: ClientInfoComponent;
  let fixture: ComponentFixture<ClientInfoComponent>;
  let info: ClientInfo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientInfoComponent],
      providers: [provideAnimations()],
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
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      "input[placeholder='817-822-5200']"
    );
    expect(input).toBeTruthy();
    input.value = "817-555-1234";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.info.phone).toBe("817-555-1234");
  });
});
