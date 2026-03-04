import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    SidebarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private platformId = inject(PLATFORM_ID);
  private sub?: Subscription;

  /** Is the sidenav drawer panel open (controls mobile overlay) */
  sidenavOpen = signal(true);
  /** Is the sidebar in icon-only collapsed mode (desktop only) */
  sidebarCollapsed = signal(false);
  /** True on phones and small tablets */
  isMobile = signal(false);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.sub = this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
        .subscribe(result => {
          const mobile = result.matches;
          this.isMobile.set(mobile);
          // On mobile: close the overlay by default; on desktop: keep it open
          this.sidenavOpen.set(!mobile);
        });
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  toggleSidenav() {
    if (this.isMobile()) {
      // Mobile: slide the drawer in/out
      this.sidenavOpen.set(!this.sidenavOpen());
    } else {
      // Desktop: collapse/expand the sidebar width
      this.sidebarCollapsed.set(!this.sidebarCollapsed());
    }
  }

  closeSidenavIfMobile() {
    if (this.isMobile()) {
      this.sidenavOpen.set(false);
    }
  }
}
