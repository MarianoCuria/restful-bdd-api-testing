Feature: Booking API — search and filters
  As a hotel admin
  I want to search bookings by guest name or dates
  So that I can find specific reservations quickly

  Scenario: Admin searches bookings by guest name
    When they create a booking for "Search" "Test"
    And they search for bookings with firstname "Search" and lastname "Test"
    Then the search results include the created booking

  Scenario: Admin searches bookings by checkin date
    When they search for bookings with checkin date "2018-01-01"
    Then the search returns at least one booking id
