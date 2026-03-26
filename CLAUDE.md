# Avila Contracting LLC — Project Guide for Claude

## What This App Is

**Avila Contracting LLC** is a **tile contracting** business web application (tile is the primary trade; occasional small miscellaneous jobs also occur). It serves two strictly separated audiences:

- **Associates only (internal)** — authenticated via Auth0. This includes the owner and any staff. They are the **only** people who can see or access the Generator, Contacts, and Login. These pages must never be visible or accessible to customers — not even the nav links.
- **Customers / public** — unauthenticated visitors who see only the public-facing pages: Home and About Us. Any future customer-facing features (job gallery, quote requests) also live in this public layer.

**Long-term vision:** Evolve into a one-stop customer portal where visitors can browse a gallery of completed tile jobs, request quotes, and contact the business directly — while the internal associate tools remain fully hidden from customers.

### Owner
Jorge's uncle owns and operates the tile contracting business. The app is built and maintained by Jorge.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (standalone components, signals) |
| UI | Angular Material 21 (Material 3, magenta/violet palette) |
| Auth | Auth0 (`@auth0/auth0-angular`) → Firebase custom token via `/api/firebase-token` |
| Database | Firebase / Firestore (contacts) |
| Storage | Firebase Storage (job photos in `jobs/` folder) |
| Testing | Vitest 4 + Angular TestBed (`@analogjs/vitest-angular`) |
| Rendering | Angular SSR (Express + `src/server.ts`) |
| Language | TypeScript 5.9 |

**Primary brand colors:**
- Navy: `#1a237e` (sidebar, footer backgrounds)
- Red accent: `#b71c1c` (active states, highlights)
- White text on dark surfaces

---

## Testing Standards — Non-Negotiable

### Coverage Target: 90 – 100% on every file

Every new component, service, resolver, guard, or pipe **must ship with a corresponding `.spec.ts` file** in the same directory. Tests are not optional or deferred — they are part of the definition of done.

### Testing Stack

- **Runner:** Vitest 4 — use `vi.fn()`, `vi.spyOn()`, `vi.mock()` (never `jasmine.createSpy`)
- **DOM / DI:** Angular `TestBed` + `ComponentFixture`
- **Observables:** `of()` / `BehaviorSubject` from RxJS for mock streams
- **Async:** `fakeAsync` + `tick()` for timers; `async/await` for promises

### Patterns to Follow

```ts
// --- Services ---
TestBed.configureTestingModule({});
service = TestBed.inject(MyService);

// --- Components (standalone) ---
await TestBed.configureTestingModule({
  imports: [MyComponent],
  providers: [
    provideRouter([]),
    { provide: SomeDep, useValue: mockSomeDep },
  ],
}).compileComponents();
fixture = TestBed.createComponent(MyComponent);
fixture.detectChanges();
el = fixture.nativeElement as HTMLElement;

// --- Mocking Auth0 ---
const mockAuth = {
  isAuthenticated$: of(false),
  user$: of(null),
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
};
{ provide: AuthService, useValue: mockAuth }

// --- Mocking Firebase services ---
// Always provide a hand-rolled mock object; never import real Firebase in tests.
// For Auth-aware services mock authState:
vi.mock('@angular/fire/auth', async (imp) => ({
  ...(await imp<typeof import('@angular/fire/auth')>()),
  authState: vi.fn(() => of({ uid: 'user-123' })),
}));
// For Storage-based services mock ref/listAll/getDownloadURL:
vi.mock('@angular/fire/storage', async (imp) => ({
  ...(await imp<typeof import('@angular/fire/storage')>()),
  ref: vi.fn(() => ({})),
  listAll: vi.fn(() => Promise.resolve({ items: [], prefixes: [] })),
  getDownloadURL: vi.fn(() => Promise.resolve('https://example.com/img.jpg')),
}));

// --- Signals / inputs ---
fixture.componentRef.setInput('inputName', value);
fixture.detectChanges();
```

### What to Test

| Type | What to cover |
|---|---|
| **Services** | Every public method: happy path, edge cases (null, empty, 0), error paths |
| **Components** | Renders correctly; input changes update the DOM; outputs/events emit; conditional blocks (`@if`) show/hide correctly |
| **Resolvers / Guards** | Returns expected data or redirects as intended |
| **Template bindings** | Key DOM elements exist; text content matches; CSS classes applied correctly |

### Naming Convention

```
describe('ClassName', () => {
  describe('methodName()', () => {
    it('does X when Y', () => { ... });
  });
});
```

---

## Component Architecture

- **All components are standalone** — import what you need in the `imports` array; no NgModules.
- Use **Angular signals** (`signal()`, `computed()`) for local state instead of class properties where practical.
- Route data is pre-loaded via **resolvers** in `src/app/resolvers/`.
- Guards live alongside routes in `app.routes.ts`.

## File Layout Conventions

```
src/app/
  <feature>/
    <feature>.component.ts      ← component class
    <feature>.component.html    ← template
    <feature>.component.css     ← scoped styles
    <feature>.component.spec.ts ← unit tests (required)
  services/
    <name>.service.ts
    <name>.service.spec.ts      ← required
  resolvers/
    <name>.resolver.ts
    <name>.resolver.spec.ts     ← required
```

---

## Key Business Rules

### Access Control — strict separation
| Page / Feature | Who can see it |
|---|---|
| Home | Everyone (public) |
| About Us | Everyone (public) |
| Login button | Associates only — must not be shown to customers |
| Generator | Associates only — Auth0-guarded |
| Contacts | Associates only — Auth0-guarded |

- Never expose the Login button, Generator link, or Contacts link to unauthenticated visitors in any nav, menu, or footer.
- Auth guard (`authGuardFn`) must be applied to every associate-only route.
- The sidebar already handles this with `@if (isAuthenticated$ | async)` — maintain this pattern for any new associate features.

### Trade & Services
- Primary trade: **tile work** (floors, walls, showers, niches, etc.)
- Also takes on occasional **small miscellaneous jobs**
- The document generator produces **estimates and invoices** as PDFs scoped to these services

### Business Facts
- Contacts are stored in **Firestore** via `ContactsService` (requires Firebase Auth)
- Job photos are stored in **Firebase Storage** under `jobs/` folder — upload photos there to make them appear in the gallery automatically. No Firestore documents needed.
- Auth flow: Auth0 login → `FirebaseAuthService.initialize()` exchanges the Auth0 ID token for a Firebase custom token via `POST /api/firebase-token` (Express) → `signInWithCustomToken()` → Firestore rules allow `request.auth != null`
- The `/api/firebase-token` endpoint validates JWT issuer AND audience (`AUTH0_CLIENT_ID`) and has a 10-req/15-min rate limit per IP
- Payment methods accepted: **Cash, Check, Zelle**
- Operating hours: **24/7, every day of the week**
- Business phone: **+1 (984) 202-6576**
