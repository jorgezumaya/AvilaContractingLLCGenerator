Write comprehensive unit tests for the file or feature described in $ARGUMENTS.

Follow the project's testing standards exactly:

## Stack
- Vitest 4: use `vi.fn()`, `vi.spyOn()`, never jasmine APIs
- Angular TestBed + ComponentFixture for components
- `of()` / `BehaviorSubject` for observable mocks
- `fakeAsync` + `tick()` for timer-based async; `async/await` for promises

## Steps

1. Read the target source file(s) in full before writing a single test.
2. Identify every public method, input, output, signal, conditional block, and branch.
3. Write a `.spec.ts` in the same directory as the source file.
4. Structure tests with nested `describe` blocks:
   - Outer: class name
   - Inner: method/feature name
   - `it()`: one specific behaviour per test, named "does X when Y"
5. Cover:
   - Happy path for every public method
   - Edge cases: null, undefined, empty array/string, zero, negative numbers
   - Error / rejection paths
   - Every `@if` / `@for` conditional in templates
   - Every `@Input()` variation and `@Output()` emission
   - Auth-gated behaviour (authenticated vs. unauthenticated) where applicable
6. Mock all external dependencies (Auth0, Firebase, services) — never import real Firebase in tests.
7. Use the standard Auth0 mock shape from CLAUDE.md when the component uses AuthService.
8. After writing, review the spec and verify every branch in the source file is exercised.
9. State the estimated line/branch/function coverage percentage at the end.

## Target
90–100% line, branch, and function coverage is required. If you cannot reach 90% explain why and what would be needed to close the gap.
