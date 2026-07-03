Feature: Booking API — list and lifecycle
  As a hotel admin
  I want to manage bookings through the REST API
  So that reservations can be queried, created, updated and removed

  Scenario: Admin retrieves all booking ids
    When they request the list of all bookings
    Then the response contains at least one booking id

  Scenario: Admin completes the full booking lifecycle
    Given the API client is authenticated as admin
    When they create a new booking
    And they retrieve the booking by id
    Then the booking details match what was submitted
    When they update the booking with new dates
    Then the updated booking reflects the changes
    When they delete the booking
    Then the deletion is confirmed
