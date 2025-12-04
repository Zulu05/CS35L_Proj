 // src/step_definitions/f07.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
const BASE_URL = "http://localhost:5173";


// 8) Scenario: Results not available after logging out from Club Info # src/features/f09.feature:7

// ✔ Given the user is not logged in # src/step_definitions/stepDefinitionsf5.ts:12
  //  ? When they press the Club Information Button
       
         When('they press the Club Information Button', async function () {
          await this.page.getByRole("button", { name: "Club Information" }).click();
         });
       
  //  ? Then they should not be able to see any matching results
       
         Then('they should not be able to see any matching results', async function () {
            await expect(this.page.getByText('Match Score:').nth(0)).not.toBeVisible();
         });

// 9) Scenario: Results available after logging in from Club Info # src/features/f09.feature:12
  //  ? Given the user is logged in
  //  ? And they are on the home page
  //  ? When they press the Club Information Button
  //  ? Then they should be able to see any matching results
  //  //  And they should match their quiz results
         
  //          Then('they should match their quiz results', async function () {
  //           await expect(this.page.getByText('Botanical Club at UCLA')).toBeVisible();
  //           await expect(this.page.getByText('Match Score: 84%')).toBeVisible();
  //           await expect(this.page.getByText('Bruin Birding Club')).toBeVisible();
  //           await expect(this.page.getByText('Match Score: 83%').nth(0)).toBeVisible();
  //           await expect(this.page.getByText('Enigma West Marches')).toBeVisible();
  //           await expect(this.page.getByText('Match Score: 81%').nth(1)).toBeVisible();
  //          });
         

       
