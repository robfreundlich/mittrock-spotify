/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

import {areIdentifiedObjectsSame, IdentifiedObject} from "client/model/IdentifiedObject";

class TestObject implements IdentifiedObject
{
  public id: string;

  constructor(id: string)
  {
    this.id = id;
  }
}

describe("Tests the IdentifiedObject class", () => {
  it("Test the equality function on two objects with the same id", () => {
    const a: TestObject = new TestObject("abcde");
    const b: TestObject = new TestObject("abcde");

    expect(areIdentifiedObjectsSame(a, b)).to.equal(true);
  });

  it("Test the equality function on two objects with different ids", () => {
    const a: TestObject = new TestObject("abcde");
    const b: TestObject = new TestObject("not abcde");

    expect(areIdentifiedObjectsSame(a, b)).to.equal(false);
  });

  it("Test the equality function on the same object", () => {
    const a: TestObject = new TestObject("abcde");

    expect(areIdentifiedObjectsSame(a, a)).to.equal(true);
  });

  it("Test the equality function when the left object is null", () => {
    const a: TestObject = new TestObject("abcde");

    expect(areIdentifiedObjectsSame(null!, a)).to.equal(false);
  });

  it("Test the equality function when the right object is null", () => {
    const a: TestObject = new TestObject("abcde");

    expect(areIdentifiedObjectsSame(a, null!)).to.equal(false);
  });

  it("Test the equality function when both object are null", () => {
    expect(areIdentifiedObjectsSame(null!, null!)).to.equal(true);
  });

  it("Test the equality function when the left object is undefined", () => {
    const a: TestObject = new TestObject("abcde");

    expect(areIdentifiedObjectsSame(undefined!, a)).to.equal(false);
  });

  it("Test the equality function when the right object is undefined", () => {
    const a: TestObject = new TestObject("abcde");

    expect(areIdentifiedObjectsSame(a, undefined!)).to.equal(false);
  });

  it("Test the equality function when both object are undefined", () => {
    expect(areIdentifiedObjectsSame(undefined!, undefined!)).to.equal(true);
  });

  it("Test the equality function when the left object is null and the right object is undefined", () => {
    expect(areIdentifiedObjectsSame(null!, undefined!)).to.equal(false);
  });

  it("Test the equality function when the left object is undefined and the right object is null", () => {
    expect(areIdentifiedObjectsSame(undefined!, null!)).to.equal(false);
  });
});
