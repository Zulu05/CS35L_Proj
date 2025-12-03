Feature: F03 - View club recommendations

  As a user of the app
  I want to be able to see the best clubs that match what I want after my quiz
  So that I know which clubs I should check out

  Scenario: Redirect to results page after submitting the quiz
    Given the user is logged and on the app
    When they submit their quiz
    Then they should be redirected to a results page

  Scenario: See a ranked list of clubs
    Given the user has completed the quiz and is on the results page
    When they scroll through the results page
    Then they should see a ranked list of clubs

  Scenario: See multiple matching club options
    Given the user is on the club info page
    When they look through all of the clubs 
    Then they should see multiple club options that correspond to their quiz answers
