import { ResolveFn } from '@angular/router';

export const generatorResolver: ResolveFn<null> = (_route, _state) => {
  // TODO: fetch generator data (e.g. saved drafts, default templates) via HttpClient
  return null;
};
