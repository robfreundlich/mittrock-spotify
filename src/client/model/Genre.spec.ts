/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import { areGenresSame, IGenre } from './Genre';

describe('Genre', () => {
  describe('areGenresSame function', () => {
    it('should return true when both genres are null or undefined', () => {
      // @ts-ignore
      expect(areGenresSame(null, null)).to.equal(true);
      // @ts-ignore
      expect(areGenresSame(undefined, undefined)).to.equal(true);
    });

    it('should return false when one of the genres is null or undefined', () => {
      const genre: IGenre = { id: "Pop", name: 'Pop', inclusionReasons: [] };
      // @ts-ignore
      expect(areGenresSame(genre, null)).to.equal(false);
      // @ts-ignore
      expect(areGenresSame(null, genre)).to.equal(false);
      // @ts-ignore
      expect(areGenresSame(genre, undefined)).to.equal(false);
      // @ts-ignore
      expect(areGenresSame(undefined, genre)).to.equal(false);
    });

    it('should return true when the names of the genres are the same', () => {
      const genre1: IGenre = { id: "Rock", name: 'Rock', inclusionReasons: [] };
      const genre2: IGenre = { id: "Rock", name: 'Rock', inclusionReasons: [] };
      expect(areGenresSame(genre1, genre2)).to.equal(true);
    });

    it('should return false when the names of the genres are different', () => {
      const genre1: IGenre = { id: "Jazz", name: 'Jazz', inclusionReasons: [] };
      const genre2: IGenre = { id: "Blues", name: 'Blues', inclusionReasons: [] };
      expect(areGenresSame(genre1, genre2)).to.equal(false);
    });
  });
});