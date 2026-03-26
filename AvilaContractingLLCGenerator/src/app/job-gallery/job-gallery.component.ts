import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JobsService } from '../services/jobs.service';
import { Job } from '../models/models';

const INTERVAL_MS = 4500;

@Component({
  selector: 'app-job-gallery',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './job-gallery.component.html',
  styleUrl: './job-gallery.component.css',
})
export class JobGalleryComponent implements OnInit, OnDestroy {
  private jobsService = inject(JobsService);
  private platformId = inject(PLATFORM_ID);
  private timer: ReturnType<typeof setInterval> | null = null;

  jobs = signal<Job[]>([]);
  loading = signal(true);
  currentIndex = signal(0);

  currentJob = computed(() => this.jobs()[this.currentIndex()] ?? null);

  ngOnInit() {
    this.jobsService.getAll().subscribe({
      next: jobs => {
        console.log('[JobGallery] loaded jobs:', jobs.length, jobs);
        this.jobs.set(jobs);
        this.loading.set(false);
        if (isPlatformBrowser(this.platformId) && jobs.length > 1) {
          this.startTimer();
        }
      },
      error: err => {
        console.error('[JobGallery] failed to load jobs:', err);
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  prev() {
    const len = this.jobs().length;
    this.currentIndex.set((this.currentIndex() - 1 + len) % len);
    this.resetTimer();
  }

  next() {
    const len = this.jobs().length;
    this.currentIndex.set((this.currentIndex() + 1) % len);
    this.resetTimer();
  }

  goTo(index: number) {
    this.currentIndex.set(index);
    this.resetTimer();
  }

  pauseTimer() {
    this.stopTimer();
  }

  resumeTimer() {
    if (this.jobs().length > 1) {
      this.startTimer();
    }
  }

  private startTimer() {
    this.timer = setInterval(() => {
      this.currentIndex.update(i => (i + 1) % this.jobs().length);
    }, INTERVAL_MS);
  }

  private stopTimer() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private resetTimer() {
    this.stopTimer();
    if (isPlatformBrowser(this.platformId) && this.jobs().length > 1) {
      this.startTimer();
    }
  }
}
