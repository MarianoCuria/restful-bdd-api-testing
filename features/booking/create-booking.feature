Feature: Room booking
  As a guest
  I want to book a room at the hotel
  So that I have accommodation confirmed for my stay

  Scenario: Guest successfully books an available room
    Given the guest is on the hotel homepage
    When they select a room and fill in their details
      | firstName | lastName | email               | phone       |
      | John      | Doe      | john@example.com    | 01234567890 |
    Then the booking is confirmed with the guest name "John Doe"

  Scenario: Guest cannot book a room with missing contact details
    Given the guest is on the hotel homepage
    When they try to book a room without providing their email
    Then an error message is shown asking for the missing information
