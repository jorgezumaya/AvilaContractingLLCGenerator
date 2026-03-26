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

class TestJobsService extends JobsService {
  listAllSpy = vi.fn(() => Promise.resolve({ items: mockItems, prefixes: [] } as any));
  getUrlSpy = vi.fn((item: { name: string }) =>
    Promise.resolve(`https://storage.example.com/jobs/${item.name}`)
  );

  protected override _folderRef() { return {} as any; }
  protected override _listAll(_folderRef: any): any { return this.listAllSpy(); }
  protected override _getDownloadURL(item: any): any { return this.getUrlSpy(item); }
}

describe('JobsService', () => {
  let service: TestJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Storage, useValue: {} },
        { provide: JobsService, useClass: TestJobsService },
      ],
    });
    service = TestBed.inject(JobsService) as unknown as TestJobsService;
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
      await firstValueFrom(service.getAll());
      expect(service.getUrlSpy).toHaveBeenCalledTimes(2);
    });
  });
});
