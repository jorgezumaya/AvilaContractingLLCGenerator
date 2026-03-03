import { Component, Input } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-document-footer",
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatCardModule],
  templateUrl: "./document-footer.component.html",
  styleUrl: "./document-footer.component.css",
})
export class DocumentFooterComponent {
  @Input() grandTotal!: number;
  @Input() payableTo!: string;
}
