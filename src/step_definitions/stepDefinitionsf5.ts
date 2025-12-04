 // src/step_definitions/f05.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
 
// 3) Scenario: Profile Page # src/features/f05.feature:7
//    ✔ Before # src/features/support/hooks.ts:38
//    ? Given the user is not logged in
//        Undefined. Implement with the following snippet:
       
         Given('the user is not logged in', async function () {
            await this.page.goto(`${BASE_URL}`);
         });
       
  //  ? When they go to the profile page url
  //      Undefined. Implement with the following snippet:
       
         When('they go to the profile page url', async function () {
           await this.page.goto(`${BASE_URL}/profile`);
         });
       
  //  ? Then they should be redirected to the login page
  //      Undefined. Implement with the following snippet:
       
         Then('it should say No logged-in user.', async function () {
             await expect(this.page.getByText("No logged-in user.")).toBeVisible();
         });
       
