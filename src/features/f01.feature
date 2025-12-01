Feature: F01 - Quiz and recommendations

  As a UCLA student using the clubs recommender
  I want to fill out the quiz and see my results
  So that I can discover clubs that match my interests

  Background:
    Given I am on the quiz page

  Scenario: Submit quiz and see answers
    When I set all traits sliders to a value
    And I submit the quiz
    Then I should see my quiz answers listed
      