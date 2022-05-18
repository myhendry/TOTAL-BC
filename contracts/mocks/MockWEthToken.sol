// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockWEthToken is ERC20 {
    constructor() ERC20("MockWEthToken", "WETH") {
        _mint(msg.sender, 100000000 * 10**decimals());
    }
}
