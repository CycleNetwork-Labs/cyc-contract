// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract WhitelistedTimeLockedERC20 is ERC20, Ownable {
    // Timestamp after which transfers are allowed for non-whitelisted users
    uint256 public transferAllowedTimestamp;
    uint256 internal ETA;
    // Mapping to track whitelisted addresses
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
    // Function to update the transfer allowed timestamp
    function setTransferAllowedTimestamp(uint256 newTimestamp) external onlyOwner {
        if (transferAllowedTimestamp > block.timestamp && ETA == 0) {
            // any value is accepted
            transferAllowedTimestamp = newTimestamp;
        } else {
            if (ETA == 0) {
                ETA = transferAllowedTimestamp + 1 days;
            }
            // can not be later than ETA
            require(newTimestamp <= ETA, "ETA!");
            transferAllowedTimestamp = newTimestamp;
        }
        emit NewTransferAllowedTimestamp(newTimestamp);
    }
    // Function to add an address to the whitelist
    function addToWhitelist(address user) external onlyOwner {
        whitelist[user] = true;
        emit WhitelistAdded(user);
    }
    // Function to remove an address from the whitelist
    function removeFromWhitelist(address user) external onlyOwner {
        whitelist[user] = false;
        emit WhitelistRemoved(user);
    }
    // Override the _beforeTokenTransfer hook to enforce time lock and whitelist
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        require(block.timestamp >= transferAllowedTimestamp || whitelist[from] || whitelist[to], "not allowed");
        super._beforeTokenTransfer(from, to, amount);
    }
}
