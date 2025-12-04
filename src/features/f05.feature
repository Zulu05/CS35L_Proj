Feature: F05 - Profile Page

  As a user of the app
  I want to access my profile page based on my login status
  So that I can see my information when logged in and be blocked when I am not

  Scenario: Profile Page
    Given the user is not logged in 
    When they go to the profile page url
    Then it should say No logged-in user.

  Scenario: Profile page when logged in
    Given the user is logged in and has completed the quiz
    When they go to the profile page url
    Then they should see their username and matches