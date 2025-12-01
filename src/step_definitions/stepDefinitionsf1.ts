 // src/step_definitions/f01.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { TRAITS } from "../models/traits";


const BASE_URL = "http://localhost:5173";
 

// 1) Scenario: Submit quiz and see answers # src/features/f01.feature:10
//    ? Given I am on the quiz page
       
        Given('I am on the quiz page', async function () {
           await this.page.goto(`${BASE_URL}/quiz`);
           await expect(this.page.getByRole("heading", { name: "Quiz" })).toBeVisible();
         });
       
//    ? When I set all traits sliders to 80
//        Undefined. Implement with the following snippet:

         When('I set all traits sliders to a value', async function () {
            const sliders = this.page.locator('input[type="range"]');
            const count = await sliders.count();
            for (let i = 0; i < count; i++) {
              const slider = sliders.nth(i);
              await slider.fill("80");
              await expect(slider).toHaveValue("80");
            }
        });
       
//    ? And I submit the quiz
//        Undefined. Implement with the following snippet:
       
         When('I submit the quiz', async function () {
           await this.page.getByRole("button", { name: "Submit" }).click();
         });
       
//    ? Then I should see my quiz answers listed
//        Undefined. Implement with the following snippet:
       
         Then('I should see my quiz answers listed', async function () {
           await expect(this.page.getByRole("heading", { name: "Your Answers" })).toBeVisible();
         });

// 2) Scenario: Submit quiz and trigger recommendations # src/features/f01.feature:15

//    ? Given I am on the quiz page
//        Undefined. Implement with the following snippet:
       
//    ? When I submit the default quiz values
//        Undefined. Implement with the following snippet:
       
         When('I submit the default quiz values', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? Then the quiz submission request should be sent to the backend
//        Undefined. Implement with the following snippet:
       
         Then('the quiz submission request should be sent to the backend', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And a recommendations request should be sent for the same user
//        Undefined. Implement with the following snippet:
       
         Then('a recommendations request should be sent for the same user', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });