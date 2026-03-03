import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { DocumentService } from "../services/document.service";
import { RoomSection } from "../models/models";

@Component({
  selector: "app-line-items",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
  ],
  templateUrl: "./line-items.component.html",
  styleUrl: "./line-items.component.css",
})
export class LineItemsComponent {
  private docService = inject(DocumentService);

  @Input() sections!: RoomSection[];

  addSection() {
    this.sections.push(this.docService.newSection());
  }

  removeSection(sIdx: number) {
    this.sections.splice(sIdx, 1);
  }

  addItem(sIdx: number) {
    this.sections[sIdx].items.push(this.docService.newItem());
  }

  removeItem(sIdx: number, iIdx: number) {
    this.sections[sIdx].items.splice(iIdx, 1);
  }
}
