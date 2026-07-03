Feature: E2E booking — UI to API verification
  As a test engineer
  I want to confirm UI bookings are persisted in the platform API
  So that the full booking stack works end to end

  Scenario: Guest books a room and the booking is stored in the API
    Given the guest is on the hotel homepage
    When they select a room and fill in their details
      | firstName | lastName | email              | phone       |
      | E2E       | Guest    | e2e.guest@test.com | 01234567890 |
    Then the booking is confirmed
    And the booking exists in the platform API
