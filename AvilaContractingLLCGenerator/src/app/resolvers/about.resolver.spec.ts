import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { aboutResolver } from "./about.resolver";

describe("aboutResolver", () => {
  it("returns null (stub — no HTTP fetch yet)", () => {
    const result = aboutResolver(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );
    expect(result).toBeNull();
  });
});
