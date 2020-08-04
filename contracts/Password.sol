// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Passord contract
/// @author Denis M. Putnam
/// @notice This contract calculate the encrypted password.
/// @dev Use at your own risk.
contract Password is Ownable {
    function calcPassword(string memory _pwd)
        public
        pure
        returns (bytes32 ePwd)
    {
        return keccak256(abi.encodePacked(_pwd));
    }
}
