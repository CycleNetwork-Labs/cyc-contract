// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

contract CycleNetworkToken is OFT, ERC20Permit {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _receiver
    ) OFT(_name, _symbol, _lzEndpoint, msg.sender) Ownable(msg.sender) ERC20Permit(_name) {
        _mint(_receiver, 1_000_000_000 * 1e18);
    }
}
