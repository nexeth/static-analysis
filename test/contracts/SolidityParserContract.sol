// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SolidityParserContract {
    struct MyStruct {
        uint256 myStructNumber;
        string myStructString;
    }

    event MyEvent(uint256 indexed myEventNumber, string myEventString);

    enum MyEnum {
        MyEnumValue1,
        MyEnumValue2,
        MyEnumValue3
    }

    modifier myModifier() {
        _;
    }

    uint256 public myNumber;

    uint256 private myPrivateNumber;

    uint256 public constant myConstant = 123;

    uint256 public immutable myImmutable;

    constructor(uint256 _myNumber) {
        myNumber = _myNumber;
        myImmutable = 789;
    }

    function myFunction(uint256 _myNumber) public {
        myNumber = _myNumber;
    }

    function setMyPrivateNumber(uint256 _myPrivateNumber) private {
        myPrivateNumber = _myPrivateNumber;
    }

    function getMyNumber() public view returns (uint256) {
        return myNumber;
    }

    function getMyPureNumber() public pure returns (uint256) {
        return 123;
    }
}
