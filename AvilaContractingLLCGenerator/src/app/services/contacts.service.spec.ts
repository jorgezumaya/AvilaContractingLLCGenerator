import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { firstValueFrom, of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ContactsService } from './contacts.service';
import * as firestoreModule from '@angular/fire/firestore';

const mockUser = { uid: 'user-123' };

vi.mock('@angular/fire/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@angular/fire/auth')>();
  return {
    ...actual,
    authState: vi.fn(() => of(mockUser)),
  };
});

vi.mock('@angular/fire/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@angular/fire/firestore')>();
  return {
    ...actual,
    collection: vi.fn(() => ({})),
    collectionData: vi.fn(() => of([])),
    addDoc: vi.fn(() => Promise.resolve({ id: 'new-id' })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    doc: vi.fn(() => ({})),
  };
});

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: {} },
      ],
    });
    service = TestBed.inject(ContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('returns an observable of contacts', async () => {
      const contacts = await firstValueFrom(service.getAll());
      expect(Array.isArray(contacts)).toBe(true);
    });

    it('passes idField option to collectionData', async () => {
      await firstValueFrom(service.getAll());
      expect(firestoreModule.collectionData).toHaveBeenCalledWith(
        expect.anything(),
        { idField: 'id' }
      );
    });
  });

  describe('add()', () => {
    it('calls addDoc with the contact data', async () => {
      await service.add({ name: 'Juan', phone: '555-1234', address: '123 Main St' });
      expect(firestoreModule.addDoc).toHaveBeenCalledWith(
        expect.anything(),
        { name: 'Juan', phone: '555-1234', address: '123 Main St' }
      );
    });
  });

  describe('update()', () => {
    it('calls updateDoc with the partial data', async () => {
      await service.update('contact-1', { phone: '555-9999' });
      expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { phone: '555-9999' }
      );
    });
  });

  describe('remove()', () => {
    it('calls deleteDoc for the given id', async () => {
      await service.remove('contact-1');
      expect(firestoreModule.deleteDoc).toHaveBeenCalledWith(expect.anything());
    });
  });
});
