// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract CycleNetworkToken is ERC20 {
    constructor(address receiver) ERC20("CycleNetwork Token", "CYC") {
        _mint(receiver, 1_000_000_000 * 1e18);
    }
}
