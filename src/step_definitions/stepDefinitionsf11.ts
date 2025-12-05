// External Dependencies
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
const BASE_URL = "http://localhost:5173";

// 34) Scenario: database page has a login page that doesn't render content # src\features\f11.feature:6
//     √ Before # src\features\support\hooks.ts:38
//     ? Given a user navigates to the database page
//         Undefined. Implement with the following snippet:

          Given('a user navigates to the database page', async function () {
            // Write code here that turns the phrase above into concrete actions
            await this.page.goto(`${BASE_URL}/database`);
          });

    // ? Then they should encounter a login page
    //     Undefined. Implement with the following snippet:

          Then('they should encounter a login page', async function () {
            // Write code here that turns the phrase above into concrete actions
            await expect(this.page.getByText("Username")).toBeVisible({timeout:10000});
            await expect(this.page.getByText("Password")).toBeVisible({timeout:10000});
          });

    // ? Then they should not see any content
    //     Undefined. Implement with the following snippet:

          Then('they should not see any content', async function () {
            // Write code here that turns the phrase above into concrete actions
            await expect(this.page.getByText("Admin Panel")).not.toBeVisible({timeout:10000});
            await expect(this.page.getByText("Library")).not.toBeVisible({timeout:10000});
          });

    // ? When their incorrect login information is put in
    //     Undefined. Implement with the following snippet:

          When('their incorrect login information is put in', async function () {
            // Write code here that turns the phrase above into concrete actions
           const username = this.page.getByLabel('Username'); 
           const password = this.page.getByLabel('Password');
           await username.fill('cucumbertest');
           await password.fill('Cucumber1!');
           await password.press("Enter");
          });

    // ? Then they should get a incorrect login indication
    //     Undefined. Implement with the following snippet:

          Then('they should get a incorrect login indication', async function () {
            // Write code here that turns the phrase above into concrete actions
            await expect(this.page.getByText("Hacker")).not.toBeVisible({timeout:10000});
          });

    // ? Then both username and password fields should clear
    //     Undefined. Implement with the following snippet:

          Then('both username and password fields should clear', async function () {
            // Write code here that turns the phrase above into concrete actions
            const username = this.page.getByLabel('Username'); 
           const password = this.page.getByLabel('Password');
           const usernameInput = await username.inputValue();
           const passwordInput = await password.inputValue();
           expect(usernameInput).toBe("");
           expect(passwordInput).toBe("");
          });

//     √ After # src\features\support\hooks.ts:42

// 36) Scenario: database page has a login page that doesn't render content # src\features\f11.feature:18
//     √ Before # src\features\support\hooks.ts:38
//     ? Given a user navigates to the admin page
//         Undefined. Implement with the following snippet:

          Given('a user navigates to the admin page', async function () {
            // Write code here that turns the phrase above into concrete actions
            await this.page.goto(`${BASE_URL}/admin`);
          });


