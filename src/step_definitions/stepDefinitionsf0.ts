// src/step_definitions/f0.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";

Given("the user is on the page", async function () {
  // TODO: navigate to the page or set up state
  // For now, we can mark as pending:
  return "pending";
});

When(
  "the user enters the value {string} in the text-input",
  async function (search: string) {
    // TODO: simulate entering `search` into the text input
    return "pending";
  }
);

When(
  "the user selects value {string} in the drop-down",
  async function (column: string) {
    // TODO: simulate selecting `column` in the dropdown
    return "pending";
  }
);

When(
  "the user sets case sensitivity switch to {string}",
  async function (caseValue: string) {
    // TODO: simulate setting case sensitivity to `caseValue`
    return "pending";
  }
);

When("the user clears filters", async function () {
  // TODO: simulate clicking 'clear filters'
  return "pending";
});

Then(
  "the user should see that search criteria are cleared",
  async function () {
    // TODO: assert that search criteria are reset
    return "pending";
  }
);

Then(
  "the user should see that the search result summary is as in the very beginning",
  async function () {
    // TODO: assert that summary matches initial state
    return "pending";
  }
);
