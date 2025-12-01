// src/features/support/hooks.ts
import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  Status,
  setWorldConstructor,
} from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";

let browser: Browser;

class CustomWorld {
  page!: Page;
  attach: any;

  constructor({ attach }: { attach: any }) {
    this.attach = attach;
  }
}

setWorldConstructor(CustomWorld);

BeforeAll({ timeout: 60_000 }, async function () {
  browser = await chromium.launch({ headless: false, slowMo: 300 });
});

AfterAll(async function () {
  await browser.close();
});

Before(async function (this: CustomWorld) {
  this.page = await browser.newPage();
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot();
    await this.attach(screenshot, "image/png");
  }

  await this.page.close();
});