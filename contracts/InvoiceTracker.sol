// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

import "./Clients.sol";
import "./Users.sol";
import "./Invoices.sol";

/// @title Invoice Tracking contract
/// @author Denis M. Putnam
/// @notice This contract tracks invoices for payment
/// @dev Use at your own risk.
contract InvoiceTracker is Invoices {
  constructor() public {
    /**
     * empty
     */
  }
}
