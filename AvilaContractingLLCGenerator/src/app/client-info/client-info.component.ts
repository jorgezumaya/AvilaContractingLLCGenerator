import { Component, computed, inject, Input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { toSignal } from "@angular/core/rxjs-interop";
import { of } from "rxjs";
import { ClientInfo, Contact } from "../models/models";
import { ContactsService } from "../services/contacts.service";

@Component({
  selector: "app-client-info",
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatAutocompleteModule],
  templateUrl: "./client-info.component.html",
  styleUrl: "./client-info.component.css",
})
export class ClientInfoComponent {
  @Input() info!: ClientInfo;

  private svc = inject(ContactsService, { optional: true });
  private allContacts = toSignal(
    this.svc ? this.svc.getAll() : of([] as Contact[]),
    { initialValue: [] as Contact[] }
  );

  nameQuery = signal('');

  filteredContacts = computed(() => {
    const q = this.nameQuery().toLowerCase();
    if (!q) return this.allContacts();
    return this.allContacts().filter(c => c.name.toLowerCase().includes(q));
  });

  onNameInput(val: string): void {
    this.nameQuery.set(val);
  }

  onContactSelected(event: MatAutocompleteSelectedEvent): void {
    const name: string = event.option.value;
    const contact = this.allContacts().find(c => c.name === name);
    if (contact) {
      this.info.phone = contact.phone;
      this.info.address = contact.address;
    }
  }
}
