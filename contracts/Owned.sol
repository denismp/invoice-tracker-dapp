// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

/// @title Owned contract
/// @author Denis M. Putnam
/// @notice This contract establishes the owner and allows for an owner change.
/// @dev Use at your own risk.
contract Owned {
  address payable owner;

  /// @author Denis M. Putnam
  /// @notice This modifier ensures that only the owner can call the funtion.
  /// @dev No other details
  modifier onlyOwner() {
      require(msg.sender == owner,"Only the owner of the contract can execute this function.");
      _;
  }

  /// @author Denis M. Putnam
  /// @notice Constructor called when the contract is deployed.
  /// @dev Sets the initial owner of the the contract.
  constructor() public payable {
      owner = msg.sender;
  }

  /// @author Denis M. Putnam
  /// @notice Get the current owner.
  /// @dev No other details.
  /// @return address current owner.
  function getCurrentOwner() public view returns(address) {
      return owner;
  }

  /// @author Denis M. Putnam
  /// @notice Change the current owner to the new owner.
  /// @dev No other details.
  /// @param newOwner new address payable owner.
  function changeOwner(address payable newOwner) public onlyOwner() {
      owner = newOwner;
  }
}
