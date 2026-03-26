import { inject, Injectable } from '@angular/core';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';
import type { StorageReference } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { Job } from '../models/models';

const JOBS_FOLDER = 'jobs';

/** Converts a storage filename into a human-readable title.
 *  e.g. "hex_floor_bath.jpg" → "Hex Floor Bath" */
function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')           // strip extension
    .replace(/[-_]/g, ' ')             // dashes/underscores → spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // title case
}

@Injectable({ providedIn: 'root' })
export class JobsService {
  private storage = inject(Storage);

  /**
   * Dynamically lists every file in the jobs/ folder in Firebase Storage.
   * No Firestore documents needed — just upload a photo and it appears.
   */
  getAll(): Observable<Job[]> {
    const folderRef = this._folderRef();

    return from(
      this._listAll(folderRef).then(result =>
        Promise.all(
          result.items.map(async item => {
            const imageUrl = await this._getDownloadURL(item);
            return {
              id: item.name,
              title: titleFromFilename(item.name),
              imageUrl,
              storagePath: `${JOBS_FOLDER}/${item.name}`,
              category: 'other',
              featured: false,
              createdAt: null,
            } satisfies Job;
          })
        )
      )
    );
  }

  protected _folderRef(): StorageReference {
    return ref(this.storage, JOBS_FOLDER);
  }

  protected _listAll(folderRef: StorageReference) {
    return listAll(folderRef);
  }

  protected _getDownloadURL(item: StorageReference) {
    return getDownloadURL(item);
  }
}
