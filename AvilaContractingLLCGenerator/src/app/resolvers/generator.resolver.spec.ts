import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { generatorResolver } from "./generator.resolver";

describe("generatorResolver", () => {
  it("returns null (stub — no HTTP fetch yet)", () => {
    const result = generatorResolver(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );
    expect(result).toBeNull();
  });
});
