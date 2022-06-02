// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "hardhat/console.sol";

contract Demo {
    string public name = "hendry";
    string public country = "singapore";
    address payable public owner;

    //* Array and Mapping Funders
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    constructor() {
        owner = payable(msg.sender);
    }

    //* Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner can call this function");
        _;
    }

    //* Fallbacks
    receive() external payable {}

    //* Array and Mapping Funders
    function fund() public payable {
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function checkFund(address funderAddress) public view returns (uint256) {
        return addressToAmountFunded[funderAddress];
    }

    function unfund() public {
        //! reset the mapping
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        //! reset the array
        funders = new address[](0);

        //! withdraw the funds - 3 ways: transfer / send / call
        payable(msg.sender).transfer(address(this).balance);
    }

    //* Deposit and Withdraw Eth
    function withdraw(uint256 _amount) external onlyOwner {
        owner.transfer(_amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory _name) external {
        name = _name;
    }

    function getCountry() public view returns (string memory) {
        return country;
    }
}
