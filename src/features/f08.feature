Feature: F08 - More User Authentication for Logging Out

  As a UCLA student
  I want to be able to log out of the app
  So that my quiz results and club matches are saved under my account but others can't access it

  Scenario: Test completed successfully to see results
    Given the user has logged in successfully
    When they finish the quiz
    And they press the Submit button
    Then they should be taken to the results page
    And they should see their club matches

  Scenario: After taking test, results should be saved to the profile from home page
    Given the user has logged in successfully
    And they are on the home page
    When they press the Profile Button
    Then they should see their top club matches
    And they should match with the quiz

  Scenario: After taking test, results should be saved to the profile from banner
    Given the user has logged in successfully
    When they press the their username button
    Then they should see their top club matches
    And they should match with the quiz

  Scenario: User is able to take quiz and log out of their account
    Given the user has logged in successfully
    When they finish the quiz
    And they press the Submit button
    And they should be able to press the Logout button
    Then they should get redirected to the Home Page

  Scenario: User is able to log out of their account
    Given the user has logged in successfully
    When they should be able to press the Logout button
    Then they should get redirected to the Home Page
    And no longer access their profile
