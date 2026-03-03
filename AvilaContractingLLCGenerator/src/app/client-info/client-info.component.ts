import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { ClientInfo } from "../models";

@Component({
  selector: "app-client-info",
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatCardModule],
  templateUrl: "./client-info.component.html",
  styleUrl: "./client-info.component.css",
})
export class ClientInfoComponent {
  @Input() info!: ClientInfo;
}
