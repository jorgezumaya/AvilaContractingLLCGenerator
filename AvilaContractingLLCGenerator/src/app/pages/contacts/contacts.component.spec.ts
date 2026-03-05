import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ContactsComponent } from './contacts.component';
import { ContactsService } from '../../services/contacts.service';
import { Contact } from '../../models/models';

const CONTACTS: Contact[] = [
  { id: '1', name: 'Waters Construction', phone: '817-822-5200', address: 'Fort Worth, TX' },
  { id: '2', name: 'Smith Builders', phone: '214-555-0100', address: 'Dallas, TX' },
];

const mockContactsService = {
  getAll: vi.fn(),
  add: vi.fn().mockResolvedValue(undefined),
  update: vi.fn().mockResolvedValue(undefined),
  remove: vi.fn().mockResolvedValue(undefined),
};

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    mockContactsService.getAll.mockReturnValue(of(CONTACTS));
    await TestBed.configureTestingModule({
      imports: [ContactsComponent],
      providers: [{ provide: ContactsService, useValue: mockContactsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the page header with "Contacts" title', () => {
    expect(el.querySelector('h1')?.textContent).toContain('Contacts');
  });

  it('shows the Add Contact button', () => {
    const btn = el.querySelector('button[aria-label="Add new contact"]');
    expect(btn).toBeTruthy();
  });

  it('renders a card for each contact', () => {
    const cards = el.querySelectorAll('mat-card');
    expect(cards.length).toBe(CONTACTS.length);
  });

  it('displays contact names', () => {
    expect(el.textContent).toContain('Waters Construction');
    expect(el.textContent).toContain('Smith Builders');
  });

  it('does not show empty message when contacts exist', () => {
    expect(el.querySelector('.empty-msg')).toBeNull();
  });

  describe('when no contacts', () => {
    beforeEach(async () => {
      TestBed.resetTestingModule();
      mockContactsService.getAll.mockReturnValue(of([]));
      await TestBed.configureTestingModule({
        imports: [ContactsComponent],
        providers: [{ provide: ContactsService, useValue: mockContactsService }],
      }).compileComponents();
      const f = TestBed.createComponent(ContactsComponent);
      f.detectChanges();
      el = f.nativeElement as HTMLElement;
    });

    it('shows empty state message', () => {
      expect(el.querySelector('.empty-msg')).toBeTruthy();
    });
  });

  describe('Add contact flow', () => {
    it('shows add form when Add Contact is clicked', () => {
      component.startAdd();
      fixture.detectChanges();
      expect(el.querySelector('.contact-form-card')).toBeTruthy();
    });

    it('hides add form on cancel', () => {
      component.startAdd();
      fixture.detectChanges();
      component.cancelAdd();
      fixture.detectChanges();
      expect(el.querySelector('.contact-form-card')).toBeNull();
    });

    it('calls service.add() and hides form on save', async () => {
      component.startAdd();
      component.form = { name: 'New Client', phone: '555-1234', address: 'TX' };
      await component.saveAdd();
      expect(mockContactsService.add).toHaveBeenCalledWith({
        name: 'New Client',
        phone: '555-1234',
        address: 'TX',
      });
      expect(component.adding()).toBe(false);
    });

    it('does not call service.add() when name is empty', async () => {
      mockContactsService.add.mockClear();
      component.startAdd();
      component.form = { name: '  ', phone: '', address: '' };
      await component.saveAdd();
      expect(mockContactsService.add).not.toHaveBeenCalled();
    });
  });

  describe('Edit contact flow', () => {
    it('sets editingId when startEdit is called', () => {
      component.startEdit(CONTACTS[0]);
      expect(component.editingId()).toBe('1');
    });

    it('calls service.update() on saveEdit', async () => {
      component.startEdit(CONTACTS[0]);
      component.editForm = { name: 'Updated', phone: '000', address: 'AZ' };
      await component.saveEdit('1');
      expect(mockContactsService.update).toHaveBeenCalledWith('1', {
        name: 'Updated', phone: '000', address: 'AZ',
      });
      expect(component.editingId()).toBeNull();
    });

    it('clears editingId on cancelEdit', () => {
      component.startEdit(CONTACTS[0]);
      component.cancelEdit();
      expect(component.editingId()).toBeNull();
    });
  });

  describe('Delete contact', () => {
    it('calls service.remove() with the contact id', async () => {
      mockContactsService.remove.mockClear();
      await component.remove('1');
      expect(mockContactsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
