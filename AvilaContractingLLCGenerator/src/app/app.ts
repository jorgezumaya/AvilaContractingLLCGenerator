import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

export enum Status {
  E = "Estimate",
  I = "Invoice",
}
@Component({
  selector: "app-root",
  imports: [RouterOutlet, MatSlideToggleModule],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("AvilaContractingLLCGenerator");
  EorI = signal(Status.E); //defaults to estimate (E), changes to invoice (I) when toggled

  toggleEorI() {
    this.EorI.set(this.EorI() === Status.E ? Status.I : Status.E);
  }
}
