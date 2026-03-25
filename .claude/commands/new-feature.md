Implement the feature described in $ARGUMENTS for the Avila Contracting LLC app.

## Process

1. **Clarify scope** — restate what will and won't be built so there are no surprises.
2. **Read first** — read every file you'll touch before writing a single line of code.
3. **Implement** — follow the project's conventions:
   - Standalone Angular components with scoped CSS
   - Angular Material components + the navy/red brand palette (`#1a237e`, `#b71c1c`)
   - Signals for local state; RxJS only for async streams
   - Auth-guard any page that should be internal-only
4. **Tests are not optional** — immediately after implementing, write a `.spec.ts` alongside every new file.  Target 90–100% line/branch/function coverage using Vitest + Angular TestBed.
5. **Review** — re-read the diff and confirm:
   - No hardcoded secrets or env values in source
   - No unused imports
   - Accessibility: interactive elements have `aria-label`
   - Mobile-responsive styles

Deliver source file(s) + spec file(s) together.
