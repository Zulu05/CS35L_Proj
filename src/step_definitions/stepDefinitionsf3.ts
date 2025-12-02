 // src/step_definitions/f01.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
 
// 6) Scenario: Redirect to results page after submitting the quiz # src/features/f03.feature:7
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the user is on the app
//        Undefined. Implement with the following snippet:
       
         Given('the user is on the app', async function () {
           await this.page.goto(`${BASE_URL}`); 
         });
       
//    ? When they submit their quiz
//        Undefined. Implement with the following snippet:

         When('they submit their quiz', async function () {
          await this.page.goto(`${BASE_URL}/quiz`); 
          await this.page.getByRole("button", { name: "Submit" }).click();
         });
       
//    ? Then they should be redirected to a results page
//        Undefined. Implement with the following snippet:
       
         Then('they should be redirected to a results page', async function () {
              await expect(this.page).toHaveURL('${BASE_URL}/matches');
         });

// 7) Scenario: See a ranked list of clubs # src/features/f03.feature:12
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the user has completed the quiz and is on the results page
//        Undefined. Implement with the following snippet:
       
         Given('the user has completed the quiz and is on the results page', async function () {
              await this.page.evaluate(() => {
                     localStorage.setItem('userId', 'test-user-id');
              });
              await this.page.goto(`${BASE_URL}/quiz`);
              await this.page.getByRole("button", { name: "Submit" }).click();
              await this.page.goto(`${BASE_URL}/matches`);
         });
       
//    ? When they scroll through the results page
//        Undefined. Implement with the following snippet:
       
         When('they scroll through the results page', async function () {
              await expect(this.page).toHaveURL('${BASE_URL}/matches');
         });
       
//    ? Then they should see a ranked list of clubs
//        Undefined. Implement with the following snippet:
       
         Then('they should see a ranked list of clubs', async function () {
           await expect(this.page.getByRole("heading", { name: "Your Top UCLA Club Matches:" })).toBeVisible();
         });
       
   

// 8) Scenario: See multiple matching club options # src/features/f03.feature:17
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the user is on the results page
//        Undefined. Implement with the following snippet:

         Given('the user is on the results page', async function () {
              await this.page.evaluate(() => {
                     localStorage.setItem('userId', 'test-user-id');
              });
              await this.page.goto(`${BASE_URL}/matches`);
         });
       
//    ? When they look through their matched clubs
//        Undefined. Implement with the following snippet:

         When('they look through their matched clubs', async function () {
              await expect(this.page.getByRole("heading", { name: "Your Top UCLA Club Matches:" })).toBeVisible();
         });
       
//    ? Then they should see multiple club options that correspond to their quiz answers
//        Undefined. Implement with the following snippet:
       
         Then('they should see multiple club options that correspond to their quiz answers', async function () {
              const answers = this.page.locator('Match');
              const count = await answers.count();               
              for (let i = 0; i < count; i++) {
                const answer = answers.nth(i);
              }
              await expect(count).toBeGreaterThan(1);
         });
       
// 9) Scenario: See why each club was matched # src/features/f03.feature:22
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the user is on the results page
//        Undefined. Implement with the following snippet:
       
       //   Given('the user is on the results page', function () {
       //     // Write code here that turns the phrase above into concrete actions
       //     return 'pending';
       //   });
       
//    ? When they look at each matched club
//        Undefined. Implement with the following snippet:
       
         When('they look at each matched club', async function () {
              await expect(this.page.getByRole("heading", { name: "Top Matches:" })).toBeVisible();
         });
       
//    ? Then they should be able to see why and how they were matched to that club
//        Undefined. Implement with the following snippet:

         Then('they should be able to see why and how they were matched to that club', async function () {
              await expect(this.page.getByRole("heading", { name: "%" })).toBeVisible();
         });