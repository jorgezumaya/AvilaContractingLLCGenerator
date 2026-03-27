import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EMAIL_MAILTO } from '../constants/contact.constants';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
})
export class SiteFooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly emailMailto = EMAIL_MAILTO;
}
