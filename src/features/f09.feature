Feature: F08 - Club Information Page Matching

  As a UCLA student
  I want to be able to see my club matches in the directory
  So that my I can see my results for all the clubs at UCLA

  Scenario: Results not available after logging out from Club Info
    Given the user is not logged in
    When they press the Club Information Button
    Then they should not be able to see any matching results

  Scenario: Results available after logging in from Club Info
    Given the user is logged in
    And they are on the home page
    When they press the Club Information Button
    Then they should be able to see any matching results