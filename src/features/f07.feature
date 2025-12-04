Feature: F07 - View club details

  As a user viewing my recommendations
  I want to see more details about a club
  So that I can decide if I want to join it

  Scenario: Navigate from results page to club info page
    Given the user has completed the quiz and is on the results page
    And the list of clubs includes "Archaeology Club"
    Then they should see a contact link for the Archaeology Club