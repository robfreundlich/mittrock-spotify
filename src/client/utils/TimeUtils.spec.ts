/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {TimeUtils} from "app/client/utils/TimeUtils";

describe("Tests the time utilities", () => {
  describe("Tests the getElapsedTime function", () => {
    const start: number = Date.now();

    it("Tests time under 1 second", () => {
      expect(TimeUtils.getElapsedTime(start, start + 3)).to.equal("3ms");
    });

    it("Tests time under 1 minute", () => {
      expect(TimeUtils.getElapsedTime(start, start + (5 * 1000) + 3)).to.equal("5.003 seconds");
    });

    it("Tests time under 1 hour", () => {
      expect(TimeUtils.getElapsedTime(start, start + (30 * 60 * 1000) + (5 * 1000) + 3)).to.equal("30 minutes, 5 seconds");
    });

    it("Tests time over 1 hour", () => {
      expect(TimeUtils.getElapsedTime(start, start + (18 * 60 * 60 * 1000) + (30 * 60 * 1000) + (5 * 1000) + 3)).to.equal("18 hours, 30 minutes");
    });

  });
});
