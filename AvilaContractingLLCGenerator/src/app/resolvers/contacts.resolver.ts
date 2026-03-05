import { ResolveFn } from '@angular/router';

export const contactsResolver: ResolveFn<null> = (_route, _state) => {
  // TODO: pre-fetch contacts for faster initial load
  return null;
};
