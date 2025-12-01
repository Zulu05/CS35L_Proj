 // src/step_definitions/f01.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
 
//  ? Given I am on the quiz page
//        Undefined. Implement with the following snippet:
       
         Given('I am on the quiz page', async function () {
           await this.page.goto(`${BASE_URL}/quiz`);
           await expect(this.page.getByRole("heading", { name: "Quiz" })).toBeVisible();
         });
       
//    ? When I set the "Social" slider to 80
//        Undefined. Implement with the following snippet:
       
         When('I set the {string} slider to {int}', function (string, int) {
         // When('I set the {string} slider to {float}', function (string, float) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And I set the "Academic" slider to 60
//        Undefined. Implement with the following snippet:
       
         When('I set the {string} slider to {int}', function (string, int) {
         // When('I set the {string} slider to {float}', function (string, float) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And I set the "Leadership" slider to 70
//        Undefined. Implement with the following snippet:
       
         When('I set the {string} slider to {int}', function (string, int) {
         // When('I set the {string} slider to {float}', function (string, float) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And I set the "Creativity" slider to 90
//        Undefined. Implement with the following snippet:
       
         When('I set the {string} slider to {int}', function (string, int) {
         // When('I set the {string} slider to {float}', function (string, float) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And I submit the quiz
//        Undefined. Implement with the following snippet:
       
         When('I submit the quiz', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? Then I should see my quiz answers listed
//        Undefined. Implement with the following snippet:
       
         Then('I should see my quiz answers listed', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });