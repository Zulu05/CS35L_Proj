Feature: F04 - Search and sort recommendations

  As a user of the app who just finished the quiz
  I want to be able to search and sort through my results
  So that I can see all my options and compare them, including clubs I am already in

  # Dependencies: Database is created, Quiz / Results page is created, Matching algorithm created

  Scenario: Open the search/filter interface on the results page
    Given the user is on the results page
    When they press the search or filter button
    Then they should see a search and sorting interface

  Scenario: Sort results by a given condition
    Given the user is viewing the search and sorting interface
    When they choose a sort condition
    Then the list of clubs should be sorted according to that condition

  Scenario: Filter clubs by text search
    Given the user has clicked the search bar on the results page
    When they enter some text
    Then only clubs matching the entered text should be displayed