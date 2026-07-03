Feature: Room booking
  As a guest
  I want to book a room at the hotel
  So that I have accommodation confirmed for my stay

  Scenario: Guest successfully books an available room
    Given the guest is on the hotel homepage
    When they select a room and fill in their details
      | firstName | lastName | email               | phone       |
      | John      | Doe      | john@example.com    | 01234567890 |
    Then the booking is confirmed
