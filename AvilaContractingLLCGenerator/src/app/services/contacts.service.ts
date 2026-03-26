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
import type { CollectionReference, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, firstValueFrom } from 'rxjs';
import { delay, filter, switchMap } from 'rxjs/operators';
import { Contact } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private fs = inject(Firestore);
  private auth = inject(Auth);

  protected get col() {
    return collection(this.fs, 'contacts');
  }

  /** Waits for Firebase Auth to be signed in before streaming contacts. */
  getAll(): Observable<Contact[]> {
    return this._authState().pipe(
      filter(user => !!user),
      delay(300), // allow Firebase Auth token to fully propagate before Firestore subscribes
      switchMap(() => this._collectionData(this.col)),
    ) as Observable<Contact[]>;
  }

  /** Waits for Firebase Auth before writing. */
  async add(contact: Omit<Contact, 'id'>): Promise<void> {
    await this.waitForAuth();
    return this._addDoc(this.col, contact).then(() => {});
  }

  async update(id: string, data: Partial<Omit<Contact, 'id'>>): Promise<void> {
    await this.waitForAuth();
    return this._updateDoc(this._doc('contacts', id), data);
  }

  async remove(id: string): Promise<void> {
    await this.waitForAuth();
    return this._deleteDoc(this._doc('contacts', id));
  }

  private waitForAuth(): Promise<unknown> {
    return firstValueFrom(this._authState().pipe(filter(user => !!user)));
  }

  protected _authState() {
    return authState(this.auth);
  }

  protected _collectionData(col: CollectionReference<DocumentData>) {
    return collectionData(col, { idField: 'id' });
  }

  protected _addDoc(col: CollectionReference<DocumentData>, data: DocumentData) {
    return addDoc(col, data);
  }

  protected _updateDoc(ref: DocumentReference<DocumentData>, data: any) {
    return updateDoc(ref, data);
  }

  protected _deleteDoc(ref: DocumentReference<DocumentData>) {
    return deleteDoc(ref);
  }

  protected _doc(...pathSegments: string[]): DocumentReference<DocumentData> {
    return doc(this.fs, pathSegments[0], ...pathSegments.slice(1)) as DocumentReference<DocumentData>;
  }
}
