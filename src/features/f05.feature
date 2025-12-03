Feature: F05 - Profile Page Navigation

  As a user of the app who just finished the quiz
  I want to be able to search and sort through my results
  So that I can see all my options and compare them, including clubs I am already in -> Change this

  Scenario: Profile Page
    Given the user is not logged in 
    When they go to the profile page url
    Then they should be redirected to the profile page