const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      ...process.env,
      be: "https://www.c-and-a.com/",
      mailsacApi: "https://mailsac.com/api",
      mailsacEmail: "ca_registration.diogo@mailsac.com",
      mailsacEmail1: "ca_registration@mailsac.com"
    },
    baseUrl: "https://www.c-and-a.com/eu/en/shop",
    downloadsFolder: 'cypress/downloads',
    specPattern: 'cypress/e2e/**/*{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js'
  }
});