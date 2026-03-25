Audit the test coverage for the file or directory described in $ARGUMENTS (or the whole src/ directory if no argument is given).

## Steps

1. For each source file (`.ts`, excluding `.spec.ts`, `index.ts`, `*.config.ts`, `*.routes.ts`, `main*.ts`, `server.ts`):
   a. Read the source file and list every public method, branch, input, output, and signal.
   b. Read the corresponding `.spec.ts` (if it exists).
   c. Cross-reference: identify which items from (a) are NOT tested in (b).

2. Produce a coverage report table:

| File | Has Spec? | Untested Methods/Branches | Est. Coverage |
|---|---|---|---|
| app/services/foo.service.ts | ✅ | none | ~95% |
| app/pages/bar/bar.component.ts | ✅ | `onSubmit() error path`, `@if (isLoading)` | ~60% |
| app/baz/baz.component.ts | ❌ | ALL | 0% |

3. Prioritise gaps: list the top files to fix, ordered by risk (services and guards first, then components).

4. For each gap, write a one-line description of the test(s) needed.

5. Offer to immediately write the missing tests for any file flagged below 90%.
