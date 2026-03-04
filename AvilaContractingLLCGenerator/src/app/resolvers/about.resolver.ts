import { ResolveFn } from '@angular/router';

export const aboutResolver: ResolveFn<null> = (_route, _state) => {
  // TODO: fetch about page content (e.g. company info, team data) via HttpClient
  return null;
};
