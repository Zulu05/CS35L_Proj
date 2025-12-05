 // src/step_definitions/f07.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
const BASE_URL = "http://localhost:5173";


// 3) Scenario: Test completed successfully to see results # src/features/f08.feature:7
  //  ? Given the user has logged in successfully
       
         Given('the user has logged in successfully', async function () {
          await this.page.goto(`${BASE_URL}/login`);
          const login = this.page.getByLabel('Username'); 
          const password = this.page.getByLabel('Password');
          await login.fill('cucumbertest');
          await password.fill('Cucumber1!');
          await this.page.getByRole("button", { name: "Sign In" }).click();
         });
       
  //  ? And they are on the quiz page
         
           Given('they are on the quiz page', async function () {
            await expect (this.page.getByText("Quiz")).toBeVisible();
          });
       
  //  ? And they press the Submit button
       
         When('they press the Submit button', async function () {
          await this.page.getByRole("button", { name: "Submit" }).click();
         });
       
  //  ? Then they should be taken to the results page
       
         Then('they should be taken to the results page', async function () {
            await expect (this.page.getByText("Your Top UCLA Club Matches")).toBeVisible();
         });
       
  //  ? And they should see their club matches
       
         Then('they should see their club matches', async function () {
          await expect (this.page.getByText("Botanical Club at UCLA")).toBeVisible();
          await expect(this.page.getByText("84% Match")).toBeVisible();

          await expect (this.page.getByText("Bruin Birding Club")).toBeVisible();
          await expect(this.page.getByText("83% Match").nth(0)).toBeVisible();

          await expect (this.page.getByText("Nerdfighters @ UCLA")).toBeVisible();
          await expect (this.page.getByText("83% Match").nth(1)).toBeVisible();

          await expect (this.page.getByText("British Bruins")).toBeVisible();
          await expect (this.page.getByText("82% Match").nth(0)).toBeVisible();

          await expect (this.page.getByText("Ayurveda at UCLA")).toBeVisible();
          await expect (this.page.getByText("82% Match").nth(1)).toBeVisible();
         });

// 4) Scenario: After taking test, results should be saved to the profile from home page # src/features/f08.feature:14
  //  ? Given the user has logged in successfully
  //  ? And they are on the home page
       
         Given('they are on the home page', async function () {
          await this.page.getByRole("button", { name: "Home" }).click();
          });
       
  //  ? When they press the Profile Button
       
         When('they go to their profile', async function () {
          await this.page.goto(`${BASE_URL}/profile`);
         });
       
  //  ? Then they should see their top club matches
       
         Then('they should see their top club matches', async function () {
          await expect (this.page.getByText("Botanical Club at UCLA (84%)")).toBeVisible();

          await expect (this.page.getByText("Bruin Birding Club (83%)")).toBeVisible();

          await expect (this.page.getByText("Nerdfighters @ UCLA (83%)")).toBeVisible();

          await expect (this.page.getByText("British Bruins (82%)")).toBeVisible();
          
          await expect (this.page.getByText("Ayurveda at UCLA (82%)")).toBeVisible();
         });
       
  //  ? And they should match with the quiz
// 5) Scenario: After taking test, results should be saved to the profile from banner # src/features/f08.feature:21
  //  ? Given the user has logged in successfully
  //  ? When they press the their username button
       
         When('they press the their username button', async function () {
          await this.page.getByRole("button", { name: "cucumbertest" }).click();
         });
       
  //  ? Then they should see their top club matches
  //  ? And they should match with the quiz

// 6) Scenario: User is able to take quiz and log out of their account # src/features/f08.feature:27
  //  ? Given the user has logged in successfully
  //  ? When they finish the quiz
  //  ? And they press the Submit button
  //  ? And they should be able to press the Logout button
       
         When('they should be able to press the Logout button', async function () {
          await this.page.getByRole("button", { name: "Logout" }).click();
         });
       
  //  ? Then they should get redirected to the Home Page
       
         Then('they should get redirected to the Home Page', async function () {
            await expect(this.page).toHaveURL(`${BASE_URL}/`);
         });
       

// 7) Scenario: User is able to log out of their account # src/features/f08.feature:34
  //  ? Given the user has logged in successfully
  //  ? When they should be able to press the Logout button
  //  ? Then they should get redirected to the Home Page
  //  ? And no longer access their profile
       
         Then('no longer access their profile', async function () {
           await expect(this.page.getByText('Profile')).not.toBeVisible();
         });
       
