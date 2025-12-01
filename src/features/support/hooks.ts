import { After, AfterAll, Before, BeforeAll, Status, World } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { setWorldConstructor } from '@cucumber/cucumber';

export let browser: Browser;
export let page: Page;

class CustomWorld {
  browser!: Browser;
  page!: Page;
}

setWorldConstructor(CustomWorld);

BeforeAll({ timeout: 5 * 1000 }, async function () {
    browser = await chromium.launch({
        headless: true,
    });
    page = await browser.newPage();
    return page;
});

AfterAll(async function () {
    return browser.close();
});

After(async function (this: World, scenario) {
    if (scenario.result?.status === Status.FAILED) {
        const attach = this.attach;
        const screenshot = await page.screenshot();
        return attach(screenshot, "image/png");
    }
});


Before(async function () {
  this.browser = await chromium.launch();
  this.page = await this.browser.newPage();
});

After(async function () {
  await this.page.close();
  await this.browser.close();
});