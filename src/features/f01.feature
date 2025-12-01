Feature: F01 - Quiz and recommendations

  As a UCLA student using the clubs recommender
  I want to fill out the quiz and see my results
  So that I can discover clubs that match my interests

  Background:
    Given I am on the quiz page

  Scenario: Submit quiz and see answers
    When I set the "Social" slider to 80
    And I set the "Academic" slider to 60
    And I set the "Leadership" slider to 70
    And I set the "Creativity" slider to 90
    And I submit the quiz
    Then I should see my quiz answers listed

  Scenario: Submit quiz and trigger recommendations
    When I submit the default quiz values
    Then the quiz submission request should be sent to the backend
    And a recommendations request should be sent for the same user

      