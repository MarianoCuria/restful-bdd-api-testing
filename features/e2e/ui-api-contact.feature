Feature: E2E contact — UI to API verification
  As a test engineer
  I want to confirm contact messages sent via UI reach the platform API
  So that the full messaging stack works end to end

  Scenario: Guest sends a message and it appears in the platform API
    Given the guest is on the hotel homepage
    When they send a contact message through the UI
    Then a confirmation message is shown thanking them
    And the message exists in the platform API
