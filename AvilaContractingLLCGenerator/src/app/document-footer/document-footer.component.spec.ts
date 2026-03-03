import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DocumentFooterComponent } from "./document-footer.component";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("DocumentFooterComponent", () => {
  let component: DocumentFooterComponent;
  let fixture: ComponentFixture<DocumentFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentFooterComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentFooterComponent);
    component = fixture.componentInstance;
    component.grandTotal = 5400;
    component.payableTo = "Avila Contracting LLC";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display the formatted grand total", () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain("$5,400.00");
  });

  it("should display the payableTo name", () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain("Avila Contracting LLC");
  });

  it("should show $0.00 when grandTotal is 0", () => {
    fixture.componentRef.setInput("grandTotal", 0);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("$0.00");
  });
});
