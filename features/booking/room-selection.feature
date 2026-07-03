Feature: Room type selection
  As a guest
  I want to choose from different room types
  So that I can find accommodation that suits my needs and budget

  Scenario Outline: Guest books a <room_type> room
    Given the guest is on the hotel homepage
    When they select the <room_type> room and complete the booking
    Then the booking is confirmed

  Examples:
    | room_type |
    | Single    |
    | Double    |
    | Suite     |
