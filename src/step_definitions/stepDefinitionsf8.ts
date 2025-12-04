 // src/step_definitions/f08.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

// Scenario: Search and filter clubs in the directory # src/features/f08.feature:7

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
  // We check if a heading with the club name exists and is visible
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
  // 1. Find the label that contains the trait name (e.g. "social")
  // look for the container div that has this label
  const label = this.page.getByText(traitName, { exact: false });
  
  // 2. Find the slider (input[type=range]) that is near this label
  // Since  HTML structure groups them in a div, scope to that parent
  const parentDiv = label.locator('..'); 
  const slider = parentDiv.locator('input[type="range"]');

  // 3. Force the value update using JavaScript evaluation (React compatible)
  await slider.evaluate((el: HTMLInputElement, val: number) => {
    el.value = String(val);
    // React requires these events to detect the change
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
});

// TODO: merge filtering functionality, git pull origin main to this branch