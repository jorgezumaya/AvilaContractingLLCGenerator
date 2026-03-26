import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { firstValueFrom, of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ContactsService } from './contacts.service';

const mockUser = { uid: 'user-123' };

class TestContactsService extends ContactsService {
  collectionDataSpy = vi.fn((_col?: any) => of([]));
  addDocSpy = vi.fn((_col?: any, _data?: any) => Promise.resolve({ id: 'new-id' }));
  updateDocSpy = vi.fn((_ref?: any, _data?: any) => Promise.resolve(undefined));
  deleteDocSpy = vi.fn((_ref?: any) => Promise.resolve(undefined));
  docSpy = vi.fn((..._args: any[]) => ({}));

  protected override get col(): any { return {}; }
  protected override _authState() { return of(mockUser) as any; }
  protected override _collectionData(_col: any): any { return this.collectionDataSpy(_col); }
  protected override _addDoc(_col: any, data: any): any { return this.addDocSpy(_col, data); }
  protected override _updateDoc(_ref: any, data: any): any { return this.updateDocSpy(_ref, data); }
  protected override _deleteDoc(_ref: any): any { return this.deleteDocSpy(_ref); }
  protected override _doc(...args: any[]): any { return this.docSpy(...args); }
}

describe('ContactsService', () => {
  let service: TestContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: {} },
        { provide: ContactsService, useClass: TestContactsService },
      ],
    });
    service = TestBed.inject(ContactsService) as TestContactsService;
  });

  afterEach(() => vi.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('returns an observable of contacts', async () => {
      const contacts = await firstValueFrom(service.getAll());
      expect(Array.isArray(contacts)).toBe(true);
    });

    it('passes the collection to collectionData', async () => {
      await firstValueFrom(service.getAll());
      expect(service.collectionDataSpy).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('add()', () => {
    it('calls addDoc with the contact data', async () => {
      await service.add({ name: 'Juan', phone: '555-1234', address: '123 Main St' });
      expect(service.addDocSpy).toHaveBeenCalledWith(
        expect.anything(),
        { name: 'Juan', phone: '555-1234', address: '123 Main St' }
      );
    });
  });

  describe('update()', () => {
    it('calls updateDoc with the partial data', async () => {
      await service.update('contact-1', { phone: '555-9999' });
      expect(service.updateDocSpy).toHaveBeenCalledWith(
        expect.anything(),
        { phone: '555-9999' }
      );
    });
  });

  describe('remove()', () => {
    it('calls deleteDoc for the given id', async () => {
      await service.remove('contact-1');
      expect(service.deleteDocSpy).toHaveBeenCalledWith(expect.anything());
    });
  });
});
