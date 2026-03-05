import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContactsService } from '../../services/contacts.service';
import { Contact } from '../../models/models';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent {
  private svc = inject(ContactsService);
  contacts = toSignal(this.svc.getAll(), { initialValue: [] as Contact[] });

  adding = signal(false);
  editingId = signal<string | null>(null);

  form: Omit<Contact, 'id'> = { name: '', phone: '', address: '' };
  editForm: Omit<Contact, 'id'> = { name: '', phone: '', address: '' };

  startAdd(): void {
    this.form = { name: '', phone: '', address: '' };
    this.adding.set(true);
    this.editingId.set(null);
  }

  cancelAdd(): void {
    this.adding.set(false);
  }

  async saveAdd(): Promise<void> {
    if (!this.form.name.trim()) return;
    await this.svc.add(this.form);
    this.adding.set(false);
  }

  startEdit(contact: Contact): void {
    this.editingId.set(contact.id ?? null);
    this.editForm = { name: contact.name, phone: contact.phone, address: contact.address };
    this.adding.set(false);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  async saveEdit(id: string): Promise<void> {
    await this.svc.update(id, this.editForm);
    this.editingId.set(null);
  }

  async remove(id: string): Promise<void> {
    await this.svc.remove(id);
  }
}
