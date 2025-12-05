 // src/step_definitions/f05.steps.ts

 // External Dependencies
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
 
// 1) Scenario: Profile Page when not logged in # src/features/f05.feature:7

//    ? Given the user is not logged in
       
         Given('the user is not logged in', async function () {
            await this.page.goto(`${BASE_URL}`);
         });
       
  //  ? When they go to the profile page url
       
         When('they go to the profile page url', async function () {
           await this.page.goto(`${BASE_URL}/profile`);
         });
       
  //  ? Then they should be redirected to the login page
       
         Then('it should say No logged-in user.', async function () {
             await expect(this.page.getByText("No logged-in user.")).toBeVisible();
         });
       
// 2) Scenario: Profile Page when logged in # src/features/f05.feature:14

  //  ? Given the user is logged in and has completed the quiz
       
         Given('the user is logged in and has completed the quiz', async function () {
          await this.page.goto(`${BASE_URL}/login`);
          const login = this.page.getByLabel('Username'); 
          const password = this.page.getByLabel('Password');
          await login.fill('cucumbertest');
          await password.fill('Cucumber1!');
          await this.page.getByRole("button", { name: "Sign In" }).click();
          await this.page.getByRole("button", { name: "Submit" }).click();
         });
       
    //  ? When they go to the profile page url (IMPLEMENTED IN SCENARIO 1)
       
        //  When('they go to the profile page url', async function () {
        //    await this.page.goto(`${BASE_URL}/profile`);
        //  });
       

  //  ? Then they should see their username and saved quiz results
       
         Then('they should see their username and matches', async function () {
           // Write code here that turns the phrase above into concrete actions
           await expect (this.page.getByText("cucumbertest")).toBeVisible();
           await expect (this.page.getByText("Matches")).toBeVisible();
         });
       
