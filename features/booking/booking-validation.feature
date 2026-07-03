Feature: Booking form validation
  As a guest
  I want to see clear error messages when I forget required information
  So that I know what to correct before completing my booking

  Scenario Outline: Guest cannot book without a required field
    Given the guest is on the hotel homepage
    When they try to book a room without providing their <field>
    Then an error message is shown asking for the missing information

  Examples:
    | field     |
    | firstname |
    | lastname  |
    | email     |
    | phone     |
