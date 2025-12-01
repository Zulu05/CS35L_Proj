Feature: F0 Searching - Medium article test

  User story:
  * As a user of Customers page
  * I want to be able to clear searching criteria
  * in order to quickly type new criteria

  Acceptance criteria:
  * After clearing, search criteria and summary should be as in the very beginning.

  Scenario Outline: Clearing of searching criteria
    Given the user is on the page
    When the user enters the value "<search>" in the text-input
    And the user selects value "<column>" in the drop-down
    And the user sets case sensitivity switch to "<case>"
    And the user clears filters
    Then the user should see that search criteria are cleared
    And the user should see that the search result summary is as in the very beginning

    Examples:
      | Search  | Column | Case  |
      | Alice   | Name   | True  |
      | alice   | Name   | False |

      