import { inject, Injectable } from '@angular/core';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';
import type { StorageReference } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';

const MARKETING_FOLDER = 'marketingpics';

@Injectable({ providedIn: 'root' })
export class MarketingService {
  private storage = inject(Storage);

  /** Lists every file in the marketing/ folder and returns their download URLs. */
  getUrls(): Observable<string[]> {
    const folderRef = this._folderRef();
    return from(
      this._listAll(folderRef).then(result =>
        Promise.all(result.items.map(item => this._getDownloadURL(item)))
      )
    );
  }

  protected _folderRef(): StorageReference {
    return ref(this.storage, MARKETING_FOLDER);
  }

  protected _listAll(folderRef: StorageReference) {
    return listAll(folderRef);
  }

  protected _getDownloadURL(item: StorageReference) {
    return getDownloadURL(item);
  }
}
