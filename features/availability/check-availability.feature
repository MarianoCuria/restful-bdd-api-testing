Feature: Check room availability
  As a guest
  I want to search for available rooms by date
  So that I can plan my stay in advance

  Scenario: Guest checks availability for future dates
    Given the guest is on the hotel homepage
    When they search for availability from "2026-09-01" to "2026-09-05"
    Then a list of available rooms is displayed

  Scenario: Guest checks availability and sees rooms update
    Given the guest is on the hotel homepage
    When they search for availability from "2026-10-10" to "2026-10-14"
    Then a list of available rooms is displayed
