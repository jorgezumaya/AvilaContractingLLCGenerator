import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { JobGalleryComponent } from '../../job-gallery/job-gallery.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, JobGalleryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
