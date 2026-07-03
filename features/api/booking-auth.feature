Feature: Booking API — authentication
  As a hotel admin
  I want the API to enforce authentication
  So that only authorized users can modify bookings

  Scenario: Admin cannot authenticate with invalid credentials
    When they authenticate with username "wronguser" and password "wrongpass"
    Then authentication fails with reason "Bad credentials"

  Scenario: Admin cannot update a booking without a token
    Given a booking exists
    When they try to update the booking without a token
    Then the API returns status 403
