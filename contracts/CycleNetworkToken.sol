// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CycleNetworkToken is ERC20, Ownable {
    uint256 public transferAllowedTimestamp;
    uint256 internal ETA;
    mapping(address => bool) public whitelist;

    event NewTransferAllowedTimestamp(uint256 newTimestamp);
    event WhitelistAdded(address user);
    event WhitelistRemoved(address user);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _transferAllowedTimestamp
    ) ERC20(name, symbol) {
        require(_transferAllowedTimestamp >= block.timestamp, "misconfig");
        transferAllowedTimestamp = _transferAllowedTimestamp;
        whitelist[msg.sender] = true;
        _mint(msg.sender, initialSupply);
    }

    function setTransferAllowedTimestamp(uint256 newTimestamp) external onlyOwner {
        if (transferAllowedTimestamp > block.timestamp && ETA == 0) {
            transferAllowedTimestamp = newTimestamp;
        } else {
            if (ETA == 0) {
                ETA = transferAllowedTimestamp + 1 days;
            }
            require(newTimestamp <= ETA, "ETA!");
            transferAllowedTimestamp = newTimestamp;
        }
        emit NewTransferAllowedTimestamp(newTimestamp);
    }

    function addToWhitelist(address user) external onlyOwner {
        whitelist[user] = true;
        emit WhitelistAdded(user);
    }

    function removeFromWhitelist(address user) external onlyOwner {
        whitelist[user] = false;
        emit WhitelistRemoved(user);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        require(block.timestamp >= transferAllowedTimestamp || whitelist[from] || whitelist[to], "not allowed");
        super._beforeTokenTransfer(from, to, amount);
    }
}
