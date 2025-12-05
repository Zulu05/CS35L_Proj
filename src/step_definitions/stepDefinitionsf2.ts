 // src/step_definitions/f02.steps.ts

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
       
         Given('the student is on the app home page and they are logged in', { timeout: 60 * 1000 }, async function () {
              
              await this.page.goto(`${BASE_URL}/login`);
              const login = this.page.getByLabel('Username'); 
              const password = this.page.getByLabel('Password');
              await login.fill('cucumbertest');
              await password.fill('Cucumber1!');
              await this.page.getByRole("button", { name: "Sign In" }).click();
              await this.page.getByRole("button", { name: "Home" }).click();
              await expect(this.page.getByRole("heading", { name: "Welcome to the Quiz App" })).toBeVisible();
         });
       
  //  ? When they press the quiz button on the main page
  //      Undefined. Implement with the following snippet:
       
        //  When('they press the quiz button on the main page', function () {

        //  });
       
  //  ? Then they should be taken to the quiz page
  //      Undefined. Implement with the following snippet:
       
         Then('they should be taken to the quiz page', async function () {
          await expect(this.page.getByRole("heading", { name: "Quiz" })).toBeVisible();
         });
       

// 3) Scenario: Answer a quiz question # src/features/f02.feature:17
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the user is on the quiz page
//        Undefined. Implement with the following snippet:
       
         Given('the user is on the quiz page', async function () {
            await this.page.goto(`${BASE_URL}/quiz`);
            await expect(this.page.getByRole("heading", { name: "Quiz" })).toBeVisible();
         });
       
  //  ? When they see a quiz question
  //      Undefined. Implement with the following snippet:
       
         When('they see a quiz question', function () {
           const question = this.page.locator('input[type="range"]');
         });
       
  //  ? Then they should be able to answer the question using a slider or button
  //      Undefined. Implement with the following snippet:
       
         Then('they should be able to answer the question using a slider or button', function () {
            const question = this.page.locator('input[type="range"]');
            expect(question).toBeDefined();
         });
       

// 4) Scenario: Submit the quiz on the last question # src/features/f02.feature:27
//    ✔ Before # src/features/support/hooks.ts:35
//    ? Given the user is taking the quiz
//        Undefined. Implement with the following snippet:

         Given('the user is taking the quiz', async function () {
              await this.page.goto(`${BASE_URL}/login`);
              const login = this.page.getByLabel('Username'); 
              const password = this.page.getByLabel('Password');
              await login.fill('cucumbertest');
              await password.fill('Cucumber1!');
              await this.page.getByRole("button", { name: "Sign In" }).click();
         });
       
       
  //  ? When they press the submit button
  //      Undefined. Implement with the following snippet:

         When('they press the submit button', async function() {
                await this.page.getByRole("button", { name: /submit/i }).click();
       });

       
  //  ? Then their quiz input should be submitted
  //      Undefined. Implement with the following snippet:
       
  Then('their quiz input should be submitted', async function () {
       const response = await this.page.request.get('http://localhost:3000/users');
       expect(response.status()).toBe(200);

       const users = await response.json();

       const user1 = users.find((u: any) => u.username === "user1");
       expect(user1).toBeDefined();

       expect(user1.quizResponses).toBeDefined();
       expect(user1.quizResponses.length).toBeGreaterThan(0);
  });
       
