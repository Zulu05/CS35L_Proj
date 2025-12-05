Feature: F11 - Testing Admin rights to database and admin page
  As a an admin user 
  I want to make sure the database and admin page are protected
  so that only those authorized can access it 

  Scenario: database page has a login page that doesn't render content
    Given a user navigates to the database page
    Then they should encounter a login page
    Then they should not see any content

Scenario: database page incorrect log in does not load content
    Given a user navigates to the database page
    When their incorrect login information is put in
    Then they should not see any content
    Then they should get a incorrect login indication
    Then both username and password fields should clear 

  Scenario: admin page has a login page that doesn't render content
    Given a user navigates to the admin page
    Then they should encounter a login page
    Then they should not see any content

Scenario: admin page incorrect log in does not load content
    Given a user navigates to the admin page
    When their incorrect login information is put in
    Then they should not see any content
    Then they should get a incorrect login indication
    Then both username and password fields should clear 