 // src/step_definitions/f05.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { deleteUser } from "../services/user.service";

const BASE_URL = "http://localhost:5173";


// 3) Scenario: Successful login with existing account # src/features/f06.feature:7

// ? Given a user account exists with username cucumbertest and password Cucumber1!
       
        //  Given('a user account exists with username cucumbertest', async function () {
        //     const newUser = await fetchSingleUserByUsername('cucumbertest');
        //     if (newUser)
        //       expect(newUser.username).toBe('cucumbertest');
        //     else 
        //       throw new Error('User has not been created');
        //  });
       
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
       
        //  Then('they should be taken to the quiz page', async function () {
        //     await expect (this.page.getByText("Quiz")).toBeVisible();
        //  });
       
  //  ? And they should see that they are logged in as cucumbertest
       
         Then('they should see that they are logged in as cucumbertest', async function () {
          await expect (this.page.getByText("cucumbertest")).toBeVisible();
         });
       
// 4) Scenario: Login fails with wrong password # src/features/f06.feature:15
  //  ? Given a user account exists with username cucumbertest and password Cucumber1!
       
        //  Given('a user account exists with username cucumbertest and password Cucumber1!', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
  //  ? And the user is on the login page
       
        //  Given('the user is on the login page', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
  //  ? When they enter username cucumbertest and password wrongpassword
       
         When('they enter username cucumbertest and password wrongpassword', async function () {
          const login = this.page.getByLabel('Username'); 
          const password = this.page.getByLabel('Password');
          await login.fill('cucumbertest');
          await password.fill('wrongpassword');
         });
       
  //  ? And they press the login button
       
        //  When('they press the login button', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
  //  ?     Then they should see an error message saying the password is not possible
       
         Then('they should see an error message saying the password is not possible', async function () {
          await expect (this.page.getByText("Password must be at least 8 characters with at least one digit, one upper and lower case letter, and one special character (@$!%*?&)")).toBeVisible();
         });
       
  //  ? And they should remain on the login page
       
         Then('they should remain on the login page', async function () {
            await expect(this.page).toHaveURL(/\/login/);
         });
       
// 5) Scenario: Login fails with non-existing username # src/features/f06.feature:23
  //  ? Given a user account exists with username cucumbertest and password Cucumber1!
       
        //  Given('a user account exists with username cucumbertest and password Cucumber1!', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
  //  ? And the user is on the login page
       
        //  Given('the user is on the login page', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
  //  ? When they enter username wrongUsername and password Cucumber1!
       
         When('they enter username wrongUsername and password Cucumber1!', async function () {
          const login = this.page.getByLabel('Username'); 
          const password = this.page.getByLabel('Password');
          await login.fill('wrongUsername');
          await password.fill('Cucumber1!');
         });
       
  //  ? And they press the login button
       
        //  When('they press the login button', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
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
       
        //  Then('a new account should be created in the database', async function () {
        //   const newUser = await fetchSingleUserByUsername('wUsername');
        //   if (newUser)
        //     expect(newUser.username).toBe('wUsername');
        //   else 
        //     throw new Error('User has not been created');
        //  });
       
  //  ? And they should be logged in
       
        //  Then('they should be logged in', async function () {
        //     await expect (this.page.getByText("wUsername")).toBeVisible();
        //  });
       
  //  ? And they should be redirected to the quiz page
       
         Then('they should stay on the sign up page', async function () {
            await expect(this.page).toHaveURL(/\/signUp/);
         });

  //  ?     And they should receive an error message

        Then('they should receive an error message', async function () {
          await expect (this.page.getByText("User already exists, try logining in instead")).toBeVisible();
         });
       