import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { homeResolver } from "./home.resolver";

describe("homeResolver", () => {
  it("returns null (stub — no HTTP fetch yet)", () => {
    const result = homeResolver(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );
    expect(result).toBeNull();
  });
});
