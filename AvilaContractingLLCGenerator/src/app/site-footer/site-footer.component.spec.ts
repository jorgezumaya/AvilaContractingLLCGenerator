import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteFooterComponent } from './site-footer.component';

describe('SiteFooterComponent', () => {
  let fixture: ComponentFixture<SiteFooterComponent>;
  let component: SiteFooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('currentYear matches the actual current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('renders business name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Avila Contracting LLC');
  });

  it('renders a phone link', () => {
    const el: HTMLElement = fixture.nativeElement;
    const phoneLink = el.querySelector('a[href^="tel:"]');
    expect(phoneLink).toBeTruthy();
  });

  it('renders the copyright year', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(String(new Date().getFullYear()));
  });
});
