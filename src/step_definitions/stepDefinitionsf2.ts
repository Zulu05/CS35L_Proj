 // src/step_definitions/f01.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
 

// 1) Scenario: Navigate from home page to the quiz page # src/features/f02.feature:7
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the student is on the app home page and they are not logged in
//        Undefined. Implement with the following snippet:
       
         Given('the student is on the app home page and they are not logged in', async function () {
          await this.page.goto(`${BASE_URL}`);
          await expect(this.page.getByRole("heading", { name: "Welcome to the Quiz App" })).toBeVisible();
         });
       
  //  ? When they press the quiz button on the main page
  //      Undefined. Implement with the following snippet:

         When('they press the quiz button on the main page', async function () {
           await this.page.getByRole("button", { name: "Start Quiz" }).click();
         });
       
  //  ? Then they should be taken to the login page
  //      Undefined. Implement with the following snippet:
       
         Then('they should be taken to the login page', async function () {
          await expect(this.page.getByRole("heading", { name: "Login" })).toBeVisible();
         });
       
// 2) Scenario: Navigate from home page to the quiz page # src/features/f02.feature:12
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the student is on the app home page and they are logged in
//        Undefined. Implement with the following snippet:
       
         Given('the student is on the app home page and they are logged in', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
  //  ? When they press the quiz button on the main page
  //      Undefined. Implement with the following snippet:
       
        //  When('they press the quiz button on the main page', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
  //  ? Then they should be taken to the quiz page
  //      Undefined. Implement with the following snippet:
       
         Then('they should be taken to the quiz page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       

// 3) Scenario: Answer a quiz question # src/features/f02.feature:17
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the user is on the quiz page
//        Undefined. Implement with the following snippet:
       
         Given('the user is on the quiz page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
  //  ? When they see a quiz question
  //      Undefined. Implement with the following snippet:
       
         When('they see a quiz question', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
  //  ? Then they should be able to answer the question using a slider or button
  //      Undefined. Implement with the following snippet:
       
         Then('they should be able to answer the question using a slider or button', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       

// 4) Scenario: Move to the next quiz question # src/features/f02.feature:22
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the user is on the quiz page and has answered the current question
//        Undefined. Implement with the following snippet:
       
         Given('the user is on the quiz page and has answered the current question', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
  //  ? When they indicate they want to continue (for example, by pressing a Next button)
  //      Undefined. Implement with the following snippet:
       
         When('they indicate they want to continue \\(for example, by pressing a Next button)', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
  //  ? Then they should be taken to the next question
  //      Undefined. Implement with the following snippet:
       
         Then('they should be taken to the next question', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       

// 5) Scenario: Submit the quiz on the last question # src/features/f02.feature:27
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the user is taking the quiz and has reached the last question
//        Undefined. Implement with the following snippet:
       
         Given('the user is taking the quiz and has reached the last question', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
  //  ? When they press the submit button
  //      Undefined. Implement with the following snippet:
       
         When('they press the submit button', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
  //  ? Then their quiz input should be submitted
  //      Undefined. Implement with the following snippet:
       
         Then('their quiz input should be submitted', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
