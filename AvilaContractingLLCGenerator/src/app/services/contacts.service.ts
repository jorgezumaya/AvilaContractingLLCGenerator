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
import { Auth, authState } from '@angular/fire/auth';
import { Observable, firstValueFrom } from 'rxjs';
import { delay, filter, switchMap } from 'rxjs/operators';
import { Contact } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private fs = inject(Firestore);
  private auth = inject(Auth);

  private get col() {
    return collection(this.fs, 'contacts');
  }

  /** Waits for Firebase Auth to be signed in before streaming contacts. */
  getAll(): Observable<Contact[]> {
    return authState(this.auth).pipe(
      filter(user => !!user),
      delay(300), // allow Firebase Auth token to fully propagate before Firestore subscribes
      switchMap(() => collectionData(this.col, { idField: 'id' })),
    ) as Observable<Contact[]>;
  }

  /** Waits for Firebase Auth before writing. */
  async add(contact: Omit<Contact, 'id'>): Promise<void> {
    await this.waitForAuth();
    return addDoc(this.col, contact).then(() => {});
  }

  async update(id: string, data: Partial<Omit<Contact, 'id'>>): Promise<void> {
    await this.waitForAuth();
    return updateDoc(doc(this.fs, 'contacts', id), data);
  }

  async remove(id: string): Promise<void> {
    await this.waitForAuth();
    return deleteDoc(doc(this.fs, 'contacts', id));
  }

  private waitForAuth(): Promise<unknown> {
    return firstValueFrom(authState(this.auth).pipe(filter(user => !!user)));
  }
}
