import { defineConfig } from "cypress";

export default defineConfig({
  downloadsFolder: "src/test/cypress/downloads",
  screenshotsFolder: "src/test/cypress/screenshots",
  videosFolder: "src/test/cypress/videos",
  fixturesFolder: "src/test/cypress/fixtures",
  _pluginsFile: "test/cypress/plugins/index.js",

  e2e: {
    setupNodeEvents(on, config) {},
    specPattern: [
      ".//src/client/**/*.spec.ts",
      ".//src/test/cypress/integration/**/*.spec.ts",
      ".//src/client/**/*.spec.tsx",
      ".//src/test/cypress/integration/**/*.spec.tsx",
    ],
  },

  component: {
    setupNodeEvents(on, config) {},
    specPattern: [
      "src/test/cypress/folders/src/client/**/*.cy.ts",
      "src/test/cypress/folders/src/test/cypress/integration/**/*.cy.ts",
      "src/test/cypress/folders/src/client/**/*.cy.tsx",
      "src/test/cypress/folders/src/test/cypress/integration/**/*.cy.tsx",
    ],
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
