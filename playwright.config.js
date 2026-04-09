// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', // де лежать тести
  timeout: 30 * 1000, // макс. час на тест
  use: {
    headless: false, // запускаємо браузер видимим
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
});
