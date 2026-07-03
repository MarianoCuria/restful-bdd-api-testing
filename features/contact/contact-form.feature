Feature: Contact form - Send Us a Message
  As a visitor
  I want to send a message to the hotel
  So that I can get in touch with the staff

  Scenario: Visitor sends a message successfully
    Given the guest is on the hotel homepage
    When they fill in the contact form with valid details
    Then a confirmation message is shown thanking them

  Scenario: Visitor submits the contact form without filling any fields
    Given the guest is on the hotel homepage
    When they submit the contact form without filling any fields
    Then an error is shown indicating the required fields are missing
