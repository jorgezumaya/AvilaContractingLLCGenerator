import { Component, inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { PdfPreviewComponent, PreviewData } from "./pdf-preview.component";

export enum Status {
  E = "Estimate",
  I = "Invoice",
}

export interface LineItem {
  description: string;
  sqFt: number | null;
  totalAmount: number | null;
}

export interface RoomSection {
  name: string;
  items: LineItem[];
}

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  private dialog = inject(MatDialog);

  protected readonly title = signal("AvilaContractingLLCGenerator");
  EorI = signal(Status.E);
  selectedDate = signal<Date | null>(null);

  // Client Info
  clientName = "";
  clientPhone = "";
  clientAddress = "";
  addressWorked = "";

  // Line items organized by room/area section
  sections: RoomSection[] = [{ name: "", items: [this.newItem()] }];

  readonly PAYABLE_TO = "Avila Contracting LLC";

  toggleEorI() {
    this.EorI.set(this.EorI() === Status.E ? Status.I : Status.E);
  }

  onDateChange(event: any) {
    this.selectedDate.set(event);
  }

  newItem(): LineItem {
    return { description: "", sqFt: null, totalAmount: null };
  }

  addSection() {
    this.sections.push({ name: "", items: [this.newItem()] });
  }

  removeSection(sIdx: number) {
    this.sections.splice(sIdx, 1);
  }

  addItem(sIdx: number) {
    this.sections[sIdx].items.push(this.newItem());
  }

  removeItem(sIdx: number, iIdx: number) {
    this.sections[sIdx].items.splice(iIdx, 1);
  }

  grandTotal(): number {
    return this.sections.reduce(
      (sum, s) => sum + s.items.reduce((sSum, i) => sSum + (i.totalAmount ?? 0), 0),
      0
    );
  }

  openPreview() {
    this.dialog.open(PdfPreviewComponent, {
      data: {
        docType: this.EorI(),
        date: this.selectedDate(),
        clientName: this.clientName,
        clientPhone: this.clientPhone,
        clientAddress: this.clientAddress,
        addressWorked: this.addressWorked,
        sections: this.sections,
        grandTotal: this.grandTotal(),
      } as PreviewData,
      width: "90vw",
      maxWidth: "900px",
      maxHeight: "90vh",
    });
  }
}
