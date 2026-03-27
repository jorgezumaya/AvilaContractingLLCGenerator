import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { JobGalleryComponent } from '../../job-gallery/job-gallery.component';
import { EMAIL_MAILTO } from '../../constants/contact.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, JobGalleryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly emailMailto = EMAIL_MAILTO;
}
