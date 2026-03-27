import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { MarketingService } from './marketing.service';
import { Storage } from '@angular/fire/storage';

const mockItems = [
  { name: 'banner_one.jpg' },
  { name: 'banner_two.jpg' },
  { name: 'banner_three.jpg' },
];

class TestMarketingService extends MarketingService {
  listAllSpy = vi.fn(() => Promise.resolve({ items: mockItems, prefixes: [] } as any));
  getUrlSpy = vi.fn((item: { name: string }) =>
    Promise.resolve(`https://storage.example.com/marketing/${item.name}`)
  );

  protected override _folderRef() { return {} as any; }
  protected override _listAll(_folderRef: any): any { return this.listAllSpy(); }
  protected override _getDownloadURL(item: any): any { return this.getUrlSpy(item); }
}

describe('MarketingService', () => {
  let service: TestMarketingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Storage, useValue: {} },
        { provide: MarketingService, useClass: TestMarketingService },
      ],
    });
    service = TestBed.inject(MarketingService) as unknown as TestMarketingService;
  });

  afterEach(() => vi.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUrls()', () => {
    it('returns one URL per file in the marketing/ folder', async () => {
      const urls = await firstValueFrom(service.getUrls());
      expect(urls).toHaveLength(3);
    });

    it('returns download URLs for every item', async () => {
      const urls = await firstValueFrom(service.getUrls());
      expect(urls[0]).toBe('https://storage.example.com/marketing/banner_one.jpg');
      expect(urls[1]).toBe('https://storage.example.com/marketing/banner_two.jpg');
    });

    it('calls getDownloadURL once per file', async () => {
      await firstValueFrom(service.getUrls());
      expect(service.getUrlSpy).toHaveBeenCalledTimes(3);
    });

    it('returns an empty array when the folder is empty', async () => {
      service.listAllSpy.mockResolvedValueOnce({ items: [], prefixes: [] } as any);
      const urls = await firstValueFrom(service.getUrls());
      expect(urls).toHaveLength(0);
    });
  });
});
