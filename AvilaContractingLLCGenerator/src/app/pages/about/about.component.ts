import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EMAIL_MAILTO } from '../../constants/contact.constants';
import { MarketingService } from '../../services/marketing.service';

const SLIDE_INTERVAL_MS = 2000;

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit, OnDestroy {
  private marketingService = inject(MarketingService);
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly emailMailto = EMAIL_MAILTO;

  bgUrls = signal<string[]>([]);
  currentIndex = signal(0);

  ngOnInit(): void {
    this.marketingService.getUrls().subscribe({
      next: urls => {
        this.bgUrls.set(urls);
        if (isPlatformBrowser(this.platformId) && urls.length > 1) {
          this.startTimer();
        }
      },
      error: () => {
        // silently ignore — background slideshow is non-critical
      },
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => {
          this.currentIndex.update(i => (i + 1) % this.bgUrls().length);
        });
      }, SLIDE_INTERVAL_MS);
    });
  }

  private stopTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
