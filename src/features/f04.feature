Feature: F04 - Search and sort recommendations

  As a UCLA student who completed the quiz
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

  Scenario: setting all filters to max
    When I click the "Filter by Attributes" button
    And I set the "academic" filter slider to 100
    And I set the "social" filter slider to 100
    And I set the "leader" filter slider to 100
    And I set the "creative" filter slider to 100
    Then I should see no clubs

  Scenario: setting all filters to max, then clearing all filters
    When I click the "Filter by Attributes" button
    And I set the "academic" filter slider to 100
    And I set the "social" filter slider to 100
    And I set the "leader" filter slider to 100
    And I set the "creative" filter slider to 100    
    And I click the "Reset Filters" button
    Then I should see "Chess Club at UCLA" visible

  Scenario: Scenario: setting all filters to max, then closing filter functions
    When I click the "Filter by Attributes" button
    And I set the "academic" filter slider to 100
    And I set the "social" filter slider to 100
    And I set the "leader" filter slider to 100
    And I set the "creative" filter slider to 100    
    And I click the Close Filters button    
    Then I should see no clubs  

  Scenario: Scenario: setting all filters to max, then closing filter functions, then clearing filters
    When I click the "Filter by Attributes" button
    And I set the "academic" filter slider to 100
    And I set the "social" filter slider to 100
    And I set the "leader" filter slider to 100
    And I set the "creative" filter slider to 100    
    And I click the "Clear all filters" button    
    Then I should see "Archaeology Club" visible

  Scenario: If I click the filter by attributes button close filters should not be visible and vice verse 
    When I click the "Filter by Attributes" button
    Then I should not see "Close Filters" visible
    And I click the Close Filters button
    Then I should not see "Filter by Attributes" visible






    