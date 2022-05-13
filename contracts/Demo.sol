// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "hardhat/console.sol";

contract Demo {
    string public name = "hendry";
    string public country = "singapore";
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner can call this function");
        _;
    }

    receive() external payable {}

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
