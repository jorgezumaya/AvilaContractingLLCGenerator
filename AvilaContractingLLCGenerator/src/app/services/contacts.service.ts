import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Contact } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private fs = inject(Firestore);

  private get col() {
    return collection(this.fs, 'contacts');
  }

  getAll(): Observable<Contact[]> {
    return collectionData(this.col, { idField: 'id' }) as Observable<Contact[]>;
  }

  add(contact: Omit<Contact, 'id'>): Promise<void> {
    return addDoc(this.col, contact).then(() => {});
  }

  update(id: string, data: Partial<Omit<Contact, 'id'>>): Promise<void> {
    return updateDoc(doc(this.fs, 'contacts', id), data);
  }

  remove(id: string): Promise<void> {
    return deleteDoc(doc(this.fs, 'contacts', id));
  }
}
