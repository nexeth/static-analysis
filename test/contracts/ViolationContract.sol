// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ViolationContract {
    // State variables with naming convention violations
    address public Address_variable; // Should use mixedCase
    uint256 public _underscore_variable; // Should not start with an underscore
    uint256 public O; // Should not use single letter names

    // Constants with naming convention violations
    string public name; // Should be UPPER_CASE_WITH_UNDERSCORES
    string public Symbol; // Should be UPPER_CASE_WITH_UNDERSCORES

    // Enum with naming convention violation
    enum DaysOfWeek {
        Monday,
        tuesday // Should use CapWords
    }

    // Function with naming convention violation
    function mixedCaseFunction() public view returns (uint256) {
        return 42;
    }

    // Modifier with naming convention violation
    modifier _underscoreModifier() {
        // Should not start with an underscore
        _;
    }

    // Constructor with a naming convention violation
    constructor(uint256 _O) {
        O = _O;
    }
}
