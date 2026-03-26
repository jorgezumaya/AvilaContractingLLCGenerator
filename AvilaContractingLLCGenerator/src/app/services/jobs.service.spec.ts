import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { JobsService } from './jobs.service';
import { Storage } from '@angular/fire/storage';
import { Job } from '../models/models';

const mockItems = [
  { name: 'hex_floor_bath.jpg' },
  { name: 'shower-wall-mosaic.jpg' },
];

vi.mock('@angular/fire/storage', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@angular/fire/storage')>();
  return {
    ...actual,
    ref: vi.fn(() => ({})),
    listAll: vi.fn(() =>
      Promise.resolve({ items: mockItems, prefixes: [] })
    ),
    getDownloadURL: vi.fn((item: { name: string }) =>
      Promise.resolve(`https://storage.example.com/jobs/${item.name}`)
    ),
  };
});

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: {} }],
    });
    service = TestBed.inject(JobsService);
  });

  afterEach(() => vi.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('returns one Job per file in the jobs/ folder', async () => {
      const jobs = await firstValueFrom(service.getAll());
      expect(jobs).toHaveLength(2);
    });

    it('converts filenames to title-case titles', async () => {
      const jobs = await firstValueFrom(service.getAll());
      expect(jobs[0].title).toBe('Hex Floor Bath');
      expect(jobs[1].title).toBe('Shower Wall Mosaic');
    });

    it('sets storagePath as jobs/<filename>', async () => {
      const jobs = await firstValueFrom(service.getAll());
      expect(jobs[0].storagePath).toBe('jobs/hex_floor_bath.jpg');
      expect(jobs[1].storagePath).toBe('jobs/shower-wall-mosaic.jpg');
    });

    it('sets category to "other" for all items', async () => {
      const jobs = await firstValueFrom(service.getAll());
      jobs.forEach((job: Job) => expect(job.category).toBe('other'));
    });

    it('sets imageUrl from getDownloadURL', async () => {
      const jobs = await firstValueFrom(service.getAll());
      expect(jobs[0].imageUrl).toBe(
        'https://storage.example.com/jobs/hex_floor_bath.jpg'
      );
    });

    it('calls getDownloadURL once per file', async () => {
      const { getDownloadURL } = await import('@angular/fire/storage');
      await firstValueFrom(service.getAll());
      expect(getDownloadURL).toHaveBeenCalledTimes(2);
    });
  });
});
