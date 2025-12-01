Feature: F01 - Quiz and recommendations

  As a student at UCLA, 
  I want to be able to easily answer questions to express my club interests 
  so that I can get more involved with the school and more extracurricular activities.


  Background:
    Given I am on the quiz page

  Scenario: Submit quiz and see answers
    When I set all traits sliders to a value
    And I submit the quiz
    Then I should see my quiz answers listed
      