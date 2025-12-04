Feature: F06 - User Authentication

  As a UCLA student
  I want to log in and sign up for the app
  So that my quiz results and club matches are saved under my account

  Scenario: Successful login with existing account
    Given the user is on the login page    
    When they enter username cucumbertest and password Cucumber1!
    And they press the login button
    Then they should be taken to the quiz page
    And they should see that they are logged in as cucumbertest

  Scenario: Login fails with wrong password
    Given the user is on the login page    
    When they enter username cucumbertest and password wrongpassword
    And they press the login button
    Then they should see an error message saying the password is not possible
    And they should remain on the login page

Scenario: Login fails with non-existing username
    Given the user is on the login page    
    When they enter username wrongUsername and password Cucumber1!
    And they press the login button
    Then they should see an error message saying the login failed
    And get a suggestion to go to the sign up page

  Scenario: Invalid email does not lead to sign up
    Given a user is on the sign up page
    When they enter an used username, valid email, and valid password
    And they press the sign up button
    Then they should stay on the sign up page
    And they should receive an error message