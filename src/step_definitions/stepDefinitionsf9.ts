 // src/step_definitions/f07.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
const BASE_URL = "http://localhost:5173";


// 8) Scenario: Results not available after logging out from Club Info # src/features/f09.feature:7

// ✔ Given the user is not logged in # src/step_definitions/stepDefinitionsf5.ts:12
  //  ? When they press the Club Information Button
       
        //  When('they press the Club Information Button', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
  //  ? Then they should not be able to see any matching results
       
         Then('they should not be able to see any matching results', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

// 9) Scenario: Results available after logging in from Club Info # src/features/f09.feature:12
  //  ? Given the user is logged in
       
         Given('the user is logged in', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
  //  ? And they are on the home page
       
        //  Given('they are on the home page', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
  //  ? When they press the Club Information Button
       
        //  When('they press the Club Information Button', function () {
        //    // Write code here that turns the phrase above into concrete actions
        //    return 'pending';
        //  });
       
  //  ? Then they should be able to see any matching results
       
         Then('they should be able to see any matching results', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
