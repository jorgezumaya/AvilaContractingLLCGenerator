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

  it('renders a mailto email link with subject and body', () => {
    const el: HTMLElement = fixture.nativeElement;
    const emailLink = el.querySelector('a[href*="mailto:"]') as HTMLAnchorElement;
    expect(emailLink).toBeTruthy();
    expect(emailLink.href).toContain('Avilacontractingllc4');
    expect(emailLink.href).toContain('subject=');
    expect(emailLink.href).toContain('body=');
  });

  it('exposes the emailMailto constant on the component', () => {
    expect(fixture.componentInstance.emailMailto).toContain('mailto:');
    expect(fixture.componentInstance.emailMailto).toContain('subject=');
  });

  it('email link text contains the business email address', () => {
    const el: HTMLElement = fixture.nativeElement;
    const emailLink = el.querySelector('a[href^="mailto:"]');
    expect(emailLink?.textContent).toContain('Avilacontractingllc4');
  });

  it('renders the copyright year', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(String(new Date().getFullYear()));
  });
});
