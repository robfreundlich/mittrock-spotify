/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

// Assuming Cypress is installed and working properly
import {compareByAddedAt} from './ComparisonFunctions';

describe("Testing comparison functions", () => {
  describe('Testing compareByAddedAt function', () => {
    it('Should compare two objects based on their addedAt property', () => {
      const earlierDate = new Date(2022, 0, 1);
      const laterDate = new Date(2022, 1, 1);

      const object1 = {name: 'name1', addedAt: laterDate};
      const object2 = {name: 'name2', addedAt: earlierDate};

      expect(compareByAddedAt(object1, object2)).to.be.greaterThan(0);

      expect(compareByAddedAt(object2, object1)).to.be.lessThan(0);
    });

    it('Should return name comparison when addedAt properties are the same for both objects', () => {
      const date = new Date(2022, 0, 1);

      const object1 = {name: 'name1', addedAt: date};
      const object2 = {name: 'name2', addedAt: date};

      expect(compareByAddedAt(object1, object2)).to.equal(-1);
    });

    it('Should return 0 when addedAt properties are the same for both objects', () => {
      const date = new Date(2022, 0, 1);

      const object1 = {name: 'name1', addedAt: date};
      const object2 = {name: 'name1', addedAt: date};

      expect(compareByAddedAt(object1, object2)).to.equal(0);
    });

    it('Should compare using `compareByName` when one or both addedAt properties are undefined', () => {
      const objectWithNoDate = {name: 'name1', addedAt: undefined};
      const objectWithDate = {name: 'name2', addedAt: new Date(2022, 0, 1)};

      expect(compareByAddedAt(objectWithNoDate, objectWithDate)).to.be.lessThan(0);

      expect(compareByAddedAt(objectWithDate, objectWithNoDate)).to.be.greaterThan(0);
    });
  })
});