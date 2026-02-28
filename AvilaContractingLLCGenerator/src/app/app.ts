import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
export enum Status {
  E = "Estimate",
  I = "Invoice",
}
@Component({
  selector: "app-root",
  imports: [RouterOutlet, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, CommonModule],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("AvilaContractingLLCGenerator");
  EorI = signal(Status.E); //defaults to estimate (E), changes to invoice (I) when toggled
  selectedDate = signal<Date | null>(null);

  toggleEorI() {
    this.EorI.set(this.EorI() === Status.E ? Status.I : Status.E);
  }

  onDateChange(event: any) {
    this.selectedDate.set(event);
  }
  
}
