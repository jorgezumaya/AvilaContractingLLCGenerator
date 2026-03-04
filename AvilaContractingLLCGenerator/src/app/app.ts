import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
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
  private router = inject(Router);
  // Optional: not provided on server (Auth0 is browser-only)
  private auth = inject(AuthService, { optional: true });
  private sub?: Subscription;

  sidenavOpen = signal(true);
  sidebarCollapsed = signal(false);
  isMobile = signal(false);
  showLoginBanner = signal(false);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.sub = this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
        .subscribe(result => {
          const mobile = result.matches;
          this.isMobile.set(mobile);
          this.sidenavOpen.set(!mobile);
        });

      this.auth?.appState$.pipe(
        concatMap(appState => this.router.navigateByUrl(appState?.target ?? '/'))
      ).subscribe(navigated => {
        if (navigated) {
          this.showLoginBanner.set(true);
          setTimeout(() => this.showLoginBanner.set(false), 4000);
        }
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
