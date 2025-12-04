 // src/step_definitions/f05.steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

//  4) Scenario: Successful login with existing account # src/features/f06.feature:7

// ? Given a user account exists with username "cucumbertest" and password "Cucumber1!"
       
         Given('a user account exists with username {string} and password {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And the user is on the login page
       
         Given('the user is on the login page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? When they enter username "cucumbertest" and password "Cucumber1!"
       
         When('they enter username {string} and password {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And they press the login button
       
         When('they press the login button', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? Then they should be taken to the home page
       
         Then('they should be taken to the home page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And they should see that they are logged in as "cucumbertest"
       
         Then('they should see that they are logged in as {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       

// 5) Scenario: Login fails with wrong password # src/features/f06.feature:15

// ? Given a user account exists with username "cucumbertest" and password "Cucumber1!"
       
         Given('a user account exists with username {string} and password {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And the user is on the login page
       
         Given('the user is on the login page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? When they enter username "cucumbertest" and password "wrongpassword"
       
         When('they enter username {string} and password {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And they press the login button
       
         When('they press the login button', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? Then they should see an error message saying the login failed
       
         Then('they should see an error message saying the login failed', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And they should remain on the login page
       
         Then('they should remain on the login page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       

// 6) Scenario: Login fails with non-existing username # src/features/f06.feature:23

// ? Given a user account exists with username "cucumbertest" and password "Cucumber1!"
       
         Given('a user account exists with username {string} and password {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And the user is on the login page
       
         Given('the user is on the login page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? When they enter username "wrongUsername" and password "Cucumber1!"
       
         When('they enter username {string} and password {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And they press the login button
       
         When('they press the login button', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? Then they should see an error message saying the login failed
       
         Then('they should see an error message saying the login failed', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And get a suggestion to go to the sign up page
       
         Then('get a suggestion to go to the sign up page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       

// 7) Scenario: Successful sign up creates a new account # src/features/f06.feature:31

// ? Given the user is on the sign up page
       
         Given('the user is on the sign up page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? When they enter a valid username, email, and password
       
         When('they enter a valid username, email, and password', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And they press the sign up button
       
         When('they press the sign up button', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? Then a new account should be created in the database
       
         Then('a new account should be created in the database', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And they should be logged in
       
         Then('they should be logged in', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       
//    ? And they should be redirected to the home page
       
         Then('they should be redirected to the home page', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });
       