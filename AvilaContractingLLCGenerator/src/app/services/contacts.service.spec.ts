import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ContactsService } from './contacts.service';

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactsService,
        // Firestore interactions are integration-tested; provide a stub here.
        { provide: Firestore, useValue: {} },
      ],
    });
    service = TestBed.inject(ContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exposes getAll() method', () => {
    expect(typeof service.getAll).toBe('function');
  });

  it('exposes add() method', () => {
    expect(typeof service.add).toBe('function');
  });

  it('exposes update() method', () => {
    expect(typeof service.update).toBe('function');
  });

  it('exposes remove() method', () => {
    expect(typeof service.remove).toBe('function');
  });
});
