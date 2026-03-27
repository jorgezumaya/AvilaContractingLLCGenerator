import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DocumentService } from '../../services/document.service';
import { PdfPreviewComponent } from '../../pdf-preview/pdf-preview.component';
import { HeaderComponent } from '../../header/header.component';
import { ClientInfoComponent } from '../../client-info/client-info.component';
import { LineItemsComponent } from '../../line-items/line-items.component';
import { DocumentFooterComponent } from '../../document-footer/document-footer.component';
import { ClientInfo, PreviewData, RoomSection, Status } from '../../models/models';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    ClientInfoComponent,
    LineItemsComponent,
    DocumentFooterComponent,
  ],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css',
})
export class GeneratorComponent {
  private dialog = inject(MatDialog);
  private docService = inject(DocumentService);

  EorI = signal(Status.E);
  selectedDate = signal<Date | null>(null);
  activeFeature = signal<string | null>(null);

  toggleFeature(name: string): void {
    this.activeFeature.set(this.activeFeature() === name ? null : name);
  }

  clientInfo: ClientInfo = { name: '', phone: '', address: '', addressWorked: '' };
  sections: RoomSection[] = [this.docService.newSection()];

  readonly PAYABLE_TO = 'Avila Contracting LLC';

  toggleEorI() {
    this.EorI.set(this.EorI() === Status.E ? Status.I : Status.E);
  }

  grandTotal(): number {
    return this.docService.grandTotal(this.sections);
  }

  openPreview() {
    this.dialog.open(PdfPreviewComponent, {
      data: {
        docType: this.EorI(),
        date: this.selectedDate(),
        clientName: this.clientInfo.name,
        clientPhone: this.clientInfo.phone,
        clientAddress: this.clientInfo.address,
        addressWorked: this.clientInfo.addressWorked,
        sections: this.sections,
        grandTotal: this.grandTotal(),
      } as PreviewData,
      width: '90vw',
      maxWidth: '900px',
      maxHeight: '90vh',
    });
  }
}
