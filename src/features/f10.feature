Feature: F10 - Quiz Page Testing

  As a UCLA student
  I want to be able to put my preferences for clubs with the quiz
  So that my I can have my own unique personal club matches

  Scenario: User can see the quiz page questions
    Given the user logged in 
    When they are on the quiz page
    Then they should be able to see the questions to answer

  Scenario: User takes the quiz and changes the sliders appropriately
    Given the user logged in 
    When they are on the quiz page
    Then they should see the sliders with the default scores
    
  Scenario: User takes the quiz and changes the sliders appropriately
    Given the user logged in 
    And they are on the quiz page
    When they change the slider to their preferences
    Then they should see the slider update with that score

  Scenario: User changes the sliders appropriately and can Submit
    Given the user logged in 
    And they are on the quiz page
    When they change the slider to their preferences
    Then they should be able to Submit
    And they should see their results

  Scenario: User changes the sliders appropriately and can Submit
    Given the user logged in 
    And the user has taken the quiz
    When they are on the results page
    Then they should see results unique to their responses
    
