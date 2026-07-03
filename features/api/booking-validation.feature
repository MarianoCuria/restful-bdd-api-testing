Feature: Booking API — validation and errors
  As a hotel admin
  I want the API to handle invalid requests gracefully
  So that I receive clear feedback when something goes wrong

  Scenario: Admin requests a booking that does not exist
    When they request booking id 999999999
    Then the API returns status 404
    And the response body contains "Not Found"

  Scenario: Admin tries to create a booking with an empty payload
    When they submit an empty booking payload
    Then the API returns status 500
