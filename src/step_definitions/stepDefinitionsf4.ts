// External Dependencies
 import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

// Scenario: Search and filter clubs in the directory # src/features/f04

Given('I am on the club directory page', async function () {
  await this.page.goto(`${BASE_URL}/clubInfo`);
  await expect(this.page.getByRole("heading", { name: "Club Directory" })).toBeVisible();
});

// Search functionality

When('I enter {string} into the search bar', async function (searchTerm: string) {
  const searchInput = this.page.getByPlaceholder("Search for a club...");
  await searchInput.fill(searchTerm);
});

Then('I should see {string} visible', async function (clubName: string) {
  // check if a heading with the club name exists and is visible
  await expect(this.page.getByRole("heading", { name: clubName })).toBeVisible();
});

Then('I should not see {string} visible', async function (clubName: string) {
  await expect(this.page.getByRole("heading", { name: clubName })).not.toBeVisible();
});

// Filtering functionality

When('I click the {string} button', async function (buttonName: string) {
  await this.page.getByRole("button", { name: buttonName }).click();
});

When('I set the {string} filter slider to {int}', async function (traitName: string, value: number) {
  // Find the container (div) that contains the specific text (e.g. "academic")
  // Then look for the slider inside that specific container
  const slider = this.page.locator('div')
    .filter({ hasText: traitName })
    .locator('input[type="range"]')
    .first(); 

  // Force the value update
  await slider.evaluate((el: HTMLInputElement, val: number) => {
    el.value = String(val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
});