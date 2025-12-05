 // src/step_definitions/f05.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";


// 3) Scenario: Successful login with existing account # src/features/f06.feature:7

// ? Given a user account exists with username cucumbertest and password Cucumber1!
  //  ? And the user is on the login page
       
         Given('the user is on the login page', async function () {
           await this.page.goto(`${BASE_URL}/login`);
         });
       
  //  ? When they enter username cucumbertest and password Cucumber1!
       
         When('they enter username cucumbertest and password Cucumber1!', async function () {
           const login = this.page.getByLabel('Username'); 
           const password = this.page.getByLabel('Password');
           await login.fill('cucumbertest');
           await password.fill('Cucumber1!');
         });
       
  //  ? And they press the login button
       
         When('they press the login button', async function () {
           await this.page.getByRole("button", { name: "Sign In" }).click();
          });
       
  //  ? Then they should be taken to the quiz page
       
  //  ? And they should see that they are logged in as cucumbertest
       
         Then('they should see that they are logged in as cucumbertest', async function () {
          await expect (this.page.getByText("cucumbertest")).toBeVisible();
         });
       
// 4) Scenario: Login fails with wrong password # src/features/f06.feature:15
  //  ? Given a user account exists with username cucumbertest and password Cucumber1!
  //  ? And the user is on the login page
  //  ? When they enter username cucumbertest and password wrongpassword
       
         When('they enter username cucumbertest and password wrongpassword', async function () {
          const login = this.page.getByLabel('Username'); 
          const password = this.page.getByLabel('Password');
          await login.fill('cucumbertest');
          await password.fill('wrongpassword');
         });
       

  //  ? Then they should see an error message saying wrong password
       
           Then('they should see an error message saying wrong password', async function () {
            await expect (this.page.getByText("Invalid password, password does not match existing user")).toBeVisible();
         });

  //  ? And they press the login button
  //  ? And they should remain on the login page
       
         Then('they should remain on the login page', async function () {
            await expect(this.page).toHaveURL(/\/login/);
         });
         
       
// 5) Scenario: Login fails with non-existing username # src/features/f06.feature:23
  //  ? Given a user account exists with username cucumbertest and password Cucumber1!
  //  ? And the user is on the login page
  //  ? When they enter username wrongUsername and password Cucumber1!
       
         When('they enter username wrongUsername and password Cucumber1!', async function () {
          const login = this.page.getByLabel('Username'); 
          const password = this.page.getByLabel('Password');
          await login.fill('wrongUsername');
          await password.fill('Cucumber1!');
         });
       
  //  ? And they press the login button
  //  ? Then they should see an error message saying the login failed
       
         Then('they should see an error message saying the login failed', async function () {
            await expect (this.page.getByText("User does not exist, try signing up first")).toBeVisible();
         });
       
  //  ? And get a suggestion to go to the sign up page
       
         Then('get a suggestion to go to the sign up page', async function () {
          await expect (this.page.getByText("No account? Sign Up Here")).toBeVisible();
         });
       
// 6) Scenario: Successful sign up creates a new account # src/features/f06.feature:31
  //  ? Given the user is on the sign up page
       
         Given('a user is on the sign up page', async function () {
            await this.page.goto(`${BASE_URL}/signUp`);
         });
       
  //  ? When they enter an used username, valid email, and valid password
       
         When('they enter an used username, valid email, and valid password', async function () {
            const login = this.page.getByLabel('Username'); 
            const email = this.page.getByLabel('Email')
            const password = this.page.getByLabel('Password');
            await login.fill('cucumbertest');
            await email.fill('testing@gmail.com');
            await password.fill('Cucumber1!');
         });
       
  //  ? And they press the sign up button
       
         When('they press the sign up button', async function () {
          await this.page.getByRole('button', { name: 'Create account', exact: true }).click();
        });
       
  //  ? Then a new account should be created in the database
  //  ? And they should be logged in
  //  ? And they should be redirected to the quiz page
       
         Then('they should stay on the sign up page', async function () {
            await expect(this.page).toHaveURL(/\/signUp/);
         });

  //  ?     And they should receive an error message

        Then('they should receive an error message', async function () {
          await expect (this.page.getByText("User already exists, try logging in instead")).toBeVisible();
         });
       