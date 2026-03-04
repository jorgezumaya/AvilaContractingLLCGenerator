import { ResolveFn } from '@angular/router';

export const homeResolver: ResolveFn<null> = (_route, _state) => {
  // TODO: fetch home page data (e.g. recent estimates, dashboard stats) via HttpClient
  return null;
};
