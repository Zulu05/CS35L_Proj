 // src/step_definitions/f01.steps.ts

 // External Dependencies
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";


const BASE_URL = "http://localhost:5173";
 

// 1) Scenario: Submit quiz and see answers # src/features/f01.feature:10
//    ? Given I am on the quiz page

        Given('I am on the quiz page', async function () {
           await this.page.goto(`${BASE_URL}/quiz`);
           await expect(this.page.getByRole("heading", { name: "Quiz" })).toBeVisible();
         });
       
//    ? When I set all traits sliders to 80

         When("I set all traits sliders to a value", async function () {
            const sliders = this.page.locator('input[type="range"]');
            const count = await sliders.count();

            for (let i = 0; i < count; i++) {
              const slider = sliders.nth(i);
            
              await slider.evaluate(
                (el: HTMLInputElement, value: number) => {
                  el.value = String(value);
                  el.dispatchEvent(new Event("input", { bubbles: true }));
                  el.dispatchEvent(new Event("change", { bubbles: true }));
                },
                80
              );
            }
        });

       
//    ? And I submit the quiz
       
         When('I submit the quiz', async function () {
           await this.page.getByRole("button", { name: "Submit" }).click();
         });
       
//    ? Then I should see my quiz answers listed
       
         Then("I should see my quiz answers listed", async function () {
              const sliders = this.page.locator('input[type="range"]');
              const count = await sliders.count();

              for (let i = 0; i < count; i++) {
                const slider = sliders.nth(i);
            
                await slider.evaluate(
                  (el: HTMLInputElement, value: number) => {
                    el.value = String(value);
                
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                  },
                  80 
                );
              }
          
              for (let i = 0; i < count; i++) {
                await expect(sliders.nth(i)).toHaveJSProperty("value", "80");
              }
        });