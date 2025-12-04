Feature: F06 - User Authentication

  As a UCLA student
  I want to log in and sign up for the app
  So that my quiz results and club matches are saved under my account

  Scenario: Successful login with existing account
    Given a user account exists with username "cucumbertest" and password "Cucumber1!"
    And the user is on the login page
    When they enter username "cucumbertest" and password "Cucumber1!"
    And they press the login button
    Then they should be taken to the home page
    And they should see that they are logged in as "cucumbertest"

  Scenario: Login fails with wrong password
    Given a user account exists with username "cucumbertest" and password "Cucumber1!"
    And the user is on the login page
    When they enter username "cucumbertest" and password "wrongpassword"
    And they press the login button
    Then they should see an error message saying the login failed
    And they should remain on the login page

Scenario: Login fails with non-existing username
    Given a user account exists with username "cucumbertest" and password "Cucumber1!"
    And the user is on the login page
    When they enter username "wrongUsername" and password "Cucumber1!"
    And they press the login button
    Then they should see an error message saying the login failed
    And get a suggestion to go to the sign up page

  Scenario: Successful sign up creates a new account
    Given the user is on the sign up page
    When they enter a valid username, email, and password
    And they press the sign up button
    Then a new account should be created in the database
    And they should be logged in
    And they should be redirected to the home page