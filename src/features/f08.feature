Feature: F08 - Club Directory Search and Filter

  As a UCLA student
  I want to search and filter the club directory
  So that I can find clubs that match my specific criteria

  Background:
    Given I am on the club directory page

  Scenario: Search for a club by name
    When I enter "Chess" into the search bar
    Then I should see "Chess Club at UCLA" visible
    And I should not see "Bruin Birding Club" visible

  Scenario: Filter clubs by specific attribute threshold
    When I click the "Filter by Attributes" button
    And I set the "academic" filter slider to 60
    Then I should see "Archaeology Club" visible

  Scenario: Resetting filters
    When I click the "Filter by Attributes" button
    And I click the "Reset Filters" button
    Then I should see "Chess Club at UCLA" visible
    And I should see "Bruin Birding Club" visible