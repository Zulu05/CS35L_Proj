 // src/step_definitions/f07.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
const BASE_URL = "http://localhost:5173";


// 13) Scenario: User can see the quiz page questions # src/features/f10.feature:7
//     ? Given the user logged in
        
          Given('the user logged in', async function () {
              await this.page.goto(`${BASE_URL}/login`);
              const login = this.page.getByLabel('Username'); 
              const password = this.page.getByLabel('Password');
              await login.fill('cucumbertest');
              await password.fill('Cucumber1!');
              await this.page.getByRole("button", { name: "Sign In" }).click();
          });
        
//     - When they are on the quiz page # src/step_definitions/stepDefinitionsf8.ts:22
//     ? Then they should be able to see the questions to answer

          Then('they should be able to see the questions to answer', async function () {
              await expect (this.page.getByText("How academically focused are you right now?")).toBeVisible();
              await expect (this.page.getByText("Would you like it to include artistic or expressive activities?")).toBeVisible();
              await expect (this.page.getByText("How active or athletic would you like the club to be?")).toBeVisible();
              await expect (this.page.getByText("Do you prefer working in groups or on your own?")).toBeVisible();
              await expect (this.page.getByText("How competitive are you when participating in activities?")).toBeVisible();
              await expect (this.page.getByText("How do you prefer to approach problems or projects?")).toBeVisible();
              await expect (this.page.getByText("How involved would you like to be in cultural or heritage-based communities?")).toBeVisible();
              await expect (this.page.getByText("How would you describe your leadership tendencies?")).toBeVisible();
              await expect (this.page.getByText("Do you prefer activities outdoors or indoors?")).toBeVisible();
              await expect (this.page.getByText("How focused are you on career or professional development?")).toBeVisible();
              await expect (this.page.getByText("Do you prefer deep research or practical project work?")).toBeVisible();
              await expect (this.page.getByText("Do you prefer clubs that focus on community service or personal growth?")).toBeVisible();
              await expect (this.page.getByText("Use the slider to indicate where you fall on this spectrum:")).toBeVisible();
              await expect (this.page.getByText("Would you like more impact or enjoyment?")).toBeVisible();
              await expect (this.page.getByText("How comfortable are you with technology and technical work?")).toBeVisible();
              await expect (this.page.getByText("How much time would you like to dedicate to a club?")).toBeVisible();
          });
        
//    4) Scenario: User takes the quiz and changes the sliders appropriately # src/features/f10.feature:12
//    ✔ Given the user logged in # src/step_definitions/stepDefinitionsf10.ts:11
//    ✔ When they are on the quiz page # src/step_definitions/stepDefinitionsf8.ts:22
//    ? Then they should see the sliders with the default scores
       
         Then('they should see the sliders with the default scores', async function () {
              const sliders = this.page.locator('role=slider'); 
              const count = await sliders.count();
              expect(count).toBe(16);
          
              for (let i = 0; i < count; i++) {
                  const value = await sliders.nth(i).inputValue();
                  expect(value).toBe('50');
              }
         });

// 14) Scenario: User takes the quiz and changes the sliders appropriately # src/features/f10.feature:12
//     ? Given the user logged in
//     - And they are on the quiz page # src/step_definitions/stepDefinitionsf8.ts:22
//     ? When they change the slider to their preferences
        
       When('they change the slider to their preferences', async function () {
              const sliders = this.page.locator('input[type="range"]');                 
              const count = await sliders.count();

              for (let i = 0; i < count; i++) {
                  await sliders.nth(i).fill('75');
              }
       });
        
//     ? Then they should see the slider update with that score
        
          Then('they should see the slider update with that score', async function () {
              const sliders = this.page.locator('role=slider'); 
              const count = await sliders.count();
          
              for (let i = 0; i < count; i++) {
                  const value = await sliders.nth(i).inputValue();
                  expect(value).toBe('75');
              }
          });
        
// 15) Scenario: User changes the sliders appropriately and can Submit # src/features/f10.feature:18
//     ? Given the user logged in
//     - And they are on the quiz page # src/step_definitions/stepDefinitionsf8.ts:22
//     ? When they change the slider to their preferences
//     ? Then they should be able to Submit
        
          Then('they should be able to Submit', async function () {
              await expect (this.page.getByText("Submit")).toBeVisible();
              await this.page.getByRole("button", { name: "Submit" }).click();
          });
        
//     ? And they should see their results
        
          Then('they should see their results', async function () {
              await expect (this.page.getByText("Bruin Earth Solutions")).toBeVisible();
              await expect(this.page.getByText("83% Match")).toBeVisible();
    
              await expect (this.page.getByText("Engineering a Better World")).toBeVisible();
              await expect(this.page.getByText("82% Match").nth(0)).toBeVisible();
    
              await expect (this.page.getByText("Congo Basin Institute Club @ UCLA")).toBeVisible();
              await expect (this.page.getByText("82% Match").nth(1)).toBeVisible();
    
              await expect (this.page.getByText("Sports Medicine Club")).toBeVisible();
              await expect (this.page.getByText("81% Match")).toBeVisible();
    
              await expect (this.page.getByText("Pre-Veterinary Society at UCLA")).toBeVisible();
              await expect (this.page.getByText("80% Match")).toBeVisible();
          });
        
// 16) Scenario: User changes the sliders appropriately and can Submit # src/features/f10.feature:25
//     ? Given the user has taken the quiz
        
          Given('the user has taken the quiz', async function () {
              await this.page.getByRole("button", { name: "Submit" }).click();
          });
        
//     ? When they are on the results page
        
          When('they are on the results page', async function () {
              await expect(this.page).toHaveURL(/\/matches/);
          });
        
//     ? Then they should see results unique to their responses

          Then('they should see results unique to their responses', async function () {
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
        