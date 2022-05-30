// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "hardhat/console.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

// interface UniswapV2Factory {
//     function getPair(address tokenA, address tokenB)
//         external
//         view
//         returns (address pair);
// }

// interface UniswapV2Pair {
//     function getReserves()
//         external
//         view
//         returns (
//             uint112 reserve0,
//             uint112 reserve1,
//             uint32 blockTimestampLast
//         );
// }

//! https://youtu.be/gyMwXuJrbJQ
//! 4:15

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);

    function description() external view returns (string memory);

    function version() external view returns (uint256);

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract Demo {
    string public name = "hendry";
    string public country = "singapore";
    address payable public owner;

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

    //* Using Interfaces
    address private chainlink_eth_usd =
        0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;

    function getV3Version() external view returns (uint256) {
        uint256 res = AggregatorV3Interface(chainlink_eth_usd).version();
        return res;
    }

    function getLatestRoundData() external view returns (int256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            chainlink_eth_usd
        );

        (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        // ETH in terms of USD
        return (price * 1e10);
    }

    //* Using Imported Interfaces
    address private factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address private weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private usdt = 0xdAC17F958D2ee523a2206206994597C13D831ec7;

    function getTokenReserves() external view returns (uint256, uint256) {
        address pair = IUniswapV2Factory(factory).getPair(dai, usdt);
        (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(pair)
            .getReserves();

        return (reserve0, reserve1);
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
