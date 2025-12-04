Feature: F02 - Navigation

  As a student at UCLA
  I want to be able to easily answer questions to express my club interests
  So that I can get more involved with the school and extracurricular activities

  Scenario: Navigate from home page to the quiz page
    Given the student is on the app home page and they are not logged in
    When they press the quiz button on the main page
    Then they should be taken to the login page

  Scenario: Navigate from home page to the quiz page
    Given the student is on the app home page and they are logged in
    When they press the quiz button on the main page
    Then they should be taken to the quiz page

  Scenario: Answer a quiz question
    Given the user is on the quiz page
    When they see a quiz question
    Then they should be able to answer the question using a slider or button

  Scenario: Submit the quiz on the last question
    Given the user is taking the quiz
    When they press the submit button
    Then their quiz input should be submitted

  Scenario: Submit quiz and see answers
    Given I am on the quiz page
    When I set all traits sliders to a value
    And I submit the quiz
    Then I should see my quiz answers listed