// External Dependencies
import { AbstractPageObject } from "./AbstractPageObject";
import { Page } from "playwright";

export class CustomersPage extends AbstractPageObject {
    protected clickToClearFiltersButton
        = "#clear-button";

    protected searchInput
        = "#search-input";

    protected searchColumn
        = "#search-column";

    protected matchCase
        = "#match-case";

    protected summary
        = "#table-resume";

    protected searchTerm
        = "#search-slogan";

    protected searchResultsTable
        = "//table";

    constructor(page: Page) {
        super(page);
    }

    /**
     * Click on Clear Filters Button.
     *
     * @return the CustomersPage class instance.
     */
    clickClearFiltersButton = async () => {
        await this.page.click(this.clickToClearFiltersButton);
        return this;
    };

    /**
     * Set value to searchInput field.
     *
     * @param input String which should be typed into the field
     * @return the CustomersPage class instance.
     */
    setSearchInput = async (input: string) => {
        await this.page.fill(this.searchInput, input);
        return this;
    };

    /**
     * Set value to Search Column Drop Down List field.
     *
     * @param value String which should match with one of values visible on the
     * dropdown
     * @return the CustomersPage class instance.
     */
    selectSearchColumnByText = async (value: string) => {
        await this.page.selectOption(this.searchColumn, value)
        return this;
    }

    /**
     * Set Match Case Checkbox field to required value.
     *
     * @param value boolean value of the checkbox status true - checked,
     * false - unchecked
     * @return the CustomersPage class instance.
     */
    setMatchCaseCheckboxField = async (value: boolean) => {
        await this.page.waitForSelector(this.matchCase)
        let element = await this.page.$(this.matchCase)
        var checkboxState = await element?.isChecked();

        if (checkboxState != value) {
            (await this.page.click(this.matchCase));
        }
        return this;
    };

    getSummaryText = async () => {
        await this.page.waitForSelector(this.summary);
        const element = await this.page.$(this.summary);
        if (!element) {
            throw new Error("Summary element not found");
        }
        return await element.textContent();
    };

    getSearchTermText = async () => {
      await this.page.waitForSelector(this.searchTerm);
      const element = await this.page.$(this.searchTerm);
      if (!element) {
        throw new Error("Search term element not found");
      }
      return await element.textContent();
    };

    getSearchInputText = async () => {
      await this.page.waitForSelector(this.searchInput);
      const element = await this.page.$(this.searchInput);
      if (!element) {
        throw new Error("Search input element not found");
      }
      return await element.textContent();
    };

    getSearchResultsTableText = async () => {
      await this.page.waitForSelector(this.searchResultsTable);
      const [element] = await this.page.$$(this.searchResultsTable);
      if (!element) {
        throw new Error("Search results table not found");
      }
      return await element.textContent();
};


    open = async () => {
        const pageUrl: string = "https://danieldelimata.github.io/sample-page/";
        return await this.page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
    };
}