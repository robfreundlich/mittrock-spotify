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

    it("Pushes a non-existent value", () => {
      const array: string[] = ["a", "b", "c", "d", "e"];
      const result: boolean = ArrayUtils.pushIfMissing(array, "f");

      expect(result).to.equal(true);
      expect(array).to.have.ordered.members(["a", "b", "c", "d", "e", "f"]);

    });

    it("Pushes an existing value with a custom equality check", () => {
      const array: string[] = ["alpha", "bravo", "charlie", "delta", "echo"];
      const result: boolean = ArrayUtils.pushIfMissing(array,
                                                       "ALPHA",
                                                       (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase());

      expect(result).to.equal(false);
      expect(array).to.have.ordered.members(["alpha", "bravo", "charlie", "delta", "echo"]);

    });


    it("Pushes an existing value with a custom equality check", () => {
      const array: string[] = ["alpha", "bravo", "charlie", "delta", "echo"];
      const result: boolean = ArrayUtils.pushIfMissing(array,
                                                       "FOXTROT",
                                                       (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase());

      expect(result).to.equal(true);
      expect(array).to.have.ordered.members(["alpha", "bravo", "charlie", "delta", "echo", "FOXTROT"]);

    });
  });

  describe("Tests pushAllIfMissing", () => {
    it("Pushes a mix of values", () => {
      const array: string[] = ["a", "b", "c", "d", "e"];
      ArrayUtils.pushAllMissing(array, ["a", "f", "c", "d", "g"]);

      expect(array).to.have.ordered.members(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("Pushes a repeated value", () => {
      const array: string[] = ["a", "b", "c", "d", "e"];
      ArrayUtils.pushAllMissing(array, ["f", "f", "f", "f", "f"]);

      expect(array).to.have.ordered.members(["a", "b", "c", "d", "e", "f"]);
    });

    it("Pushes mix of values with a custom equality check", () => {
      const array: string[] = ["alpha", "bravo", "charlie", "delta", "echo"];
      ArrayUtils.pushAllMissing(array,
                                ["ALPHA", "foxtrot", "CHARLIE", "delta", "GOLF"],
                                (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase());

      expect(array).to.have.ordered.members(["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "GOLF"]);

    });


    it("Pushes a repeated value with a custom equality check", () => {
      const array: string[] = ["alpha", "bravo", "charlie", "delta", "echo"];
      ArrayUtils.pushAllMissing(array,
                                ["FOXTROT", "foxtrot", "FoXtRoT"],
                                (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase());

      expect(array).to.have.ordered.members(["alpha", "bravo", "charlie", "delta", "echo", "FOXTROT"]);
    });
  });
});
