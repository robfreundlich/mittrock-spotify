/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {ArrayUtils} from "client/utils/ArrayUtils";

describe("Tests the ArrayUtils library", () => {
  describe("Tests pushIfMissing", () => {
    it("Pushes an existing value", () => {
      const array: string[] = ["a", "b", "c", "d", "e"];
      const result: boolean = ArrayUtils.pushIfMissing(array, "a");

      expect(result).to.equal(false);
      expect(array).to.have.ordered.members(["a", "b", "c", "d", "e"]);
    });

    it("Pushes a non-existant value", () => {
      const array: string[] = ["a", "b", "c", "d", "e"];
      const result: boolean = ArrayUtils.pushIfMissing(array, "f");

      expect(result).to.equal(true);
      expect(array).to.have.ordered.members(["a", "b", "c", "d", "e", "f"]);

    });
  });
});
