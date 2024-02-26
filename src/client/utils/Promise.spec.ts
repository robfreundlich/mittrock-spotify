/*
 * Copyright (c) 2024. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */


describe("Tests Promises", async () => {
  describe("Tests Promises.all", async () => {
    it("tests simple counting function", async () => {
      const functionCalled: boolean[] = [false, false, false, false, false, false, false, false, false, false];

      const promises: Promise<void>[] = [];

      const log = (n: number): Promise<void> => {
        return new Promise(resolve => {
          setTimeout(() => {
              // cy.debug(`Number is ${n}`);
              functionCalled[n] = true;
              resolve();
            },
            1000);
        });
      }

      for (let i = 0; i < 10; i++)
      {
        promises[i] = log(i);
      }

      await Promise.all([...promises]);
      for (let i: number = 0; i < 10; i++)
      {
        expect(functionCalled[i]).to.equal(true, `Index ${i}`);
      }
    })
  })
})