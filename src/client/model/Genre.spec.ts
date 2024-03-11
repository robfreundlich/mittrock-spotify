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
      const genre: IGenre = { name: 'Pop' };
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
      const genre1: IGenre = { name: 'Rock' };
      const genre2: IGenre = { name: 'Rock' };
      expect(areGenresSame(genre1, genre2)).to.equal(true);
    });

    it('should return false when the names of the genres are different', () => {
      const genre1: IGenre = { name: 'Jazz' };
      const genre2: IGenre = { name: 'Blues' };
      expect(areGenresSame(genre1, genre2)).to.equal(false);
    });
  });
});