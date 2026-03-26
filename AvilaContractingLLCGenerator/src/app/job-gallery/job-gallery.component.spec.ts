import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { JobGalleryComponent } from './job-gallery.component';
import { JobsService } from '../services/jobs.service';
import { Job } from '../models/models';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const makeJob = (overrides: Partial<Job> = {}): Job => ({
  id: '1',
  title: 'Hex Floor',
  category: 'floor',
  imageUrl: 'https://example.com/hex.jpg',
  storagePath: 'jobs/hex.jpg',
  featured: true,
  createdAt: { seconds: 1700000000 },
  ...overrides,
});

const twoJobs: Job[] = [
  makeJob({ id: '1', title: 'Hex Floor' }),
  makeJob({ id: '2', title: 'Shower Mosaic', category: 'shower', imageUrl: 'https://example.com/mosaic.jpg' }),
];

function setup(jobs: Job[]) {
  const mockJobsService = { getAll: vi.fn(() => of(jobs)) };

  TestBed.configureTestingModule({
    imports: [JobGalleryComponent, NoopAnimationsModule],
    providers: [{ provide: JobsService, useValue: mockJobsService }],
  });

  const fixture = TestBed.createComponent(JobGalleryComponent);
  fixture.detectChanges();
  return { fixture, component: fixture.componentInstance, el: fixture.nativeElement as HTMLElement };
}

describe('JobGalleryComponent', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  describe('loading state', () => {
    it('shows spinner before jobs arrive', () => {
      const mockJobsService = { getAll: vi.fn(() => of([])) };
      TestBed.configureTestingModule({
        imports: [JobGalleryComponent, NoopAnimationsModule],
        providers: [{ provide: JobsService, useValue: mockJobsService }],
      });
      const fixture = TestBed.createComponent(JobGalleryComponent);
      // Before detectChanges, loading is true
      expect(fixture.componentInstance.loading()).toBe(true);
    });
  });

  describe('empty state', () => {
    it('shows empty message when no jobs', () => {
      const { el } = setup([]);
      expect(el.textContent).toContain('Photos coming soon');
    });

    it('does not render carousel when no jobs', () => {
      const { el } = setup([]);
      expect(el.querySelector('.carousel')).toBeNull();
    });
  });

  describe('single job', () => {
    it('renders the carousel', () => {
      const { el } = setup([makeJob()]);
      expect(el.querySelector('.carousel')).toBeTruthy();
    });

    it('shows the job image', () => {
      const { el } = setup([makeJob()]);
      const img = el.querySelector('.carousel-image') as HTMLImageElement;
      expect(img.src).toContain('hex.jpg');
    });

    it('shows the job title', () => {
      const { el } = setup([makeJob()]);
      expect(el.querySelector('.caption-title')?.textContent).toContain('Hex Floor');
    });

    it('shows the category badge', () => {
      const { el } = setup([makeJob()]);
      expect(el.querySelector('.caption-category')?.textContent?.trim()).toBe('floor');
    });

    it('does not render nav arrows for a single job', () => {
      const { el } = setup([makeJob()]);
      expect(el.querySelector('.carousel-prev')).toBeNull();
    });

    it('does not render dots for a single job', () => {
      const { el } = setup([makeJob()]);
      expect(el.querySelector('.carousel-dots')).toBeNull();
    });
  });

  describe('multiple jobs', () => {
    it('renders prev and next arrow buttons', () => {
      const { el } = setup(twoJobs);
      expect(el.querySelector('.carousel-prev')).toBeTruthy();
      expect(el.querySelector('.carousel-next')).toBeTruthy();
    });

    it('renders correct number of dot indicators', () => {
      const { el } = setup(twoJobs);
      expect(el.querySelectorAll('.dot').length).toBe(2);
    });

    it('first dot is active on load', () => {
      const { el } = setup(twoJobs);
      const dots = el.querySelectorAll('.dot');
      expect(dots[0].classList).toContain('active');
      expect(dots[1].classList).not.toContain('active');
    });

    it('next() advances the index', () => {
      const { component, fixture } = setup(twoJobs);
      component.next();
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(1);
    });

    it('next() wraps around from last to first', () => {
      const { component, fixture } = setup(twoJobs);
      component.next();
      component.next();
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(0);
    });

    it('prev() wraps from first to last', () => {
      const { component, fixture } = setup(twoJobs);
      component.prev();
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(1);
    });

    it('goTo() sets a specific index', () => {
      const { component, fixture } = setup(twoJobs);
      component.goTo(1);
      fixture.detectChanges();
      expect(component.currentIndex()).toBe(1);
    });

    it('currentJob() reflects the active index', () => {
      const { component } = setup(twoJobs);
      component.goTo(1);
      expect(component.currentJob()?.title).toBe('Shower Mosaic');
    });
  });

  describe('timer', () => {
    it('auto-advances after interval', () => {
      const { component } = setup(twoJobs);
      expect(component.currentIndex()).toBe(0);
      vi.advanceTimersByTime(4500);
      expect(component.currentIndex()).toBe(1);
      component.ngOnDestroy();
    });

    it('pauses on mouseenter and resumes on mouseleave', () => {
      const { component, el } = setup(twoJobs);
      const carousel = el.querySelector('.carousel') as HTMLElement;
      carousel.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(4500);
      expect(component.currentIndex()).toBe(0); // paused — no advance
      carousel.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(4500);
      expect(component.currentIndex()).toBe(1); // now running
      component.ngOnDestroy();
    });
  });

  describe('ngOnDestroy', () => {
    it('clears the timer', () => {
      const { component } = setup(twoJobs);
      component.ngOnDestroy();
      vi.advanceTimersByTime(10000);
      expect(component.currentIndex()).toBe(0); // no advance after destroy
    });
  });
});
