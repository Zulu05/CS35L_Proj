import { Page } from "playwright";

export abstract class AbstractPageObject {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}