 // src/step_definitions/f07.steps.ts

 // External Dependencies
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

// Scenario: Navigate from results page to club info page # src\features\f07.feature:7
//    ? Given the user has completed the quiz and is on the club info page

         Given('the user has completed the quiz and is on the club info page', async function () {
           // Write code here that turns the phrase above into concrete actions
           await this.page.goto(`${BASE_URL}/quiz`);
           await this.page.getByRole("button", { name: "Submit" }).click();
           await this.page.getByRole("button", { name: "Back to Home" }).click();
           await this.page.getByRole("button", { name: "Club Information" }).click();
         });
//    ? And the list of clubs includes Archaeology Club
         Given('the list of clubs includes Archaeology Club', async function () {
           // Write code here that turns the phrase above into concrete actions
        //    console.log(await this.page.url());
           expect(this.page.getByRole("heading", {name: "Archaeology Club"})).toBeVisible();
         });

//    ? Then they should see a contact link for the Archaeology Club
         Then('they should see a contact link for the Archaeology Club', async function () {
           // Write code here that turns the phrase above into concrete actions
           const clubCard = this.page.getByRole("heading", {name: "Archaeology Club"}).locator("..");
           const contactLink = clubCard.getByRole("link", {name: "Contact"});
            await expect(contactLink).toHaveAttribute('href', 'mailto:archaeologyclubatucla@gmail.com');
         });
