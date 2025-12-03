 // src/step_definitions/f01.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
 
// 10) Scenario: Open the search/filter interface on the results page # src/features/f04.feature:9
//     ✔ Before # src/features/support/hooks.ts:35
//     ? Given the user is on the results page
//         Undefined. Implement with the following snippet:
        
          // Given('the user is on the results page', function () { ALREADY IMPLEMETED
          //   // Write code here that turns the phrase above into concrete actions
          //   return 'pending';
          // });
        
//     ? When they press the search or filter button
//         Undefined. Implement with the following snippet:

          When('they press the search or filter button', async function () {
              await this.page.getByRole("button", { name: "Filter" }).click();
          });
        
//     ? Then they should see a search and sorting interface
//         Undefined. Implement with the following snippet:

          Then('they should see a search and sorting interface', async function () {
              await expect(this.page.getByRole("heading", { name: "Filter by" })).toBeVisible();
          });
        
// 11) Scenario: Sort results by a given condition # src/features/f04.feature:14
//     ✔ Before # src/features/support/hooks.ts:35
//     ? Given the user is viewing the search and sorting interface
//         Undefined. Implement with the following snippet:

          Given('the user is viewing the search and sorting interface', async function () {
              await this.page.goto(`${BASE_URL}/clubInfo`);
          });
        
//     ? When they choose a sort condition
//         Undefined. Implement with the following snippet:
        
          When('they choose a sort condition', async function () {
              await this.page.getByRole("button", { name: "Filter" }).click();
              await expect(this.page.getByRole("heading", { name: "Filter by" })).toBeVisible();
              await this.page.getByRole("button", { name: "Name" }).click();
          });
        
//     ? Then the list of clubs should be sorted according to that condition
//         Undefined. Implement with the following snippet:
        
          Then('the list of clubs should be sorted according to that condition', async function () {
            const headings = this.page.getByRole('heading', { level: 2 });
            const names = (await headings.allTextContents())
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0);

            // Verify names are sorted A->Z (case-insensitive)
            const expected = [...names].sort((a, b) =>
              a.localeCompare(b, undefined, { sensitivity: 'base' })
            );
            expect(names).toEqual(expected);
          });