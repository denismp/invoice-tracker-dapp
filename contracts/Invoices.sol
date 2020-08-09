// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

import "./InvoiceData.sol";

/// @title Invoices contract
/// @author Denis M. Putnam
/// @notice This contract handles invoices for payment
/// @dev Use at your own risk.
contract Invoices is InvoiceData {
    event duplicateInvoiceEvent(string _clientName, string _invoiceHash);

    event addInvoiceEvent(string _clientName, string _invoiceHash);

    event addUserEvent(address payable _address, string _name, string _pwd);

    modifier noDupInvoice(
        string memory _clientName,
        string memory _invoiceHash
    ) {
        bool flag = isNoDuplicateInvoice(_clientName, _invoiceHash);
        if (flag == false) {
            emit duplicateInvoiceEvent(_clientName, _invoiceHash);
        }
        require(flag, "Duplicate invoice");
        _;
    }

    /// @author Denis M. Putnam
    /// @notice Check for no duplicate invoice.
    /// @param _clientName name of the client.
    /// @param _invoiceHash invoice hash value.
    /// @dev no other details.
    function isNoDuplicateInvoice(
        string memory _clientName,
        string memory _invoiceHash
    ) public returns (bool) {
        for (uint256 i = 0; i < clientNameInvoicesCountMap[_clientName]; i++) {
            if (
                keccak256(abi.encodePacked(_invoiceHash)) ==
                keccak256(
                    abi.encodePacked(clientNameInvoicesMap[_clientName][i])
                )
            ) {
                return false;
            }
        }
        return true;
    }

    /// @author Denis M. Putnam
    /// @notice Add a user
    /// @param _address wallet account address for the user
    /// @param _name user name
    /// @param _pwd unencrypted password
    /// @dev no other details.
    function addUser(
        address payable _address,
        string memory _name,
        string memory _pwd
    ) public noDupUser(_address) {
        bytes32 epwd = keccak256(abi.encodePacked(_pwd));
        usersMap[_address] = User(_name, epwd, true);
        userIndexMap[userCount] = _address;
        userCount += 1;
        emit addUserEvent(_address, _name, _pwd);
    }

    /// @author Denis M. Putnam
    /// @notice Add an invoice to track
    /// @param _userAddress user address
    /// @param _pwd user password in plaintext
    /// @param _clientName name of the client
    /// @param _invoiceHash invoice hash data value
    /// @dev Add's an invoice to be tracked.
    function addInvoice(
        address _userAddress,
        string memory _pwd,
        string memory _clientName,
        string memory _invoiceHash
    )
        public
        userOnly(_userAddress, _clientName)
        isValidPassword(_userAddress, _pwd)
        noDupInvoice(_clientName, _invoiceHash)
    {
        clientNameInvoicesMap[_clientName].push(_invoiceHash);
        //clientNameInvoiceNumMap[_clientName].push(_invoiceNumber);

        incremmentInvoiceCount(_clientName);

        emit addInvoiceEvent(_clientName, _invoiceHash);
    }

    function incremmentInvoiceCount(string memory _clientName)
        private
        returns (uint256)
    {
        return clientNameInvoicesCountMap[_clientName] += 1;
    }

    /// @author Denis M. Putnam
    /// @notice Get the count of invoices associated with the given client name
    /// @param _userAddress user address
    /// @param _pwd plaintext user password
    /// @param _clientName name of the client
    /// @dev no other details.
    /// @return count of invoices associated with the given client
    function getInvoiceCount(
        address _userAddress,
        string memory _pwd,
        string memory _clientName
    )
        public
        view
        userOnly(_userAddress, _clientName)
        isValidPassword(_userAddress, _pwd)
        returns (uint256 count)
    {
        count = clientNameInvoicesCountMap[_clientName];
        // count = getInvoiceCount(_clientName);
    }

    /// @author Denis M. Putnam
    /// @notice Get an invoice
    /// @param _userAddress user address
    /// @param _pwd plain text password
    /// @param _clientName name of the client
    /// @param _invoiceIndex invoice index being requested.
    /// @dev no other details
    /// @return invoiceHash
    function getInvoice(
        address _userAddress,
        string memory _pwd,
        string memory _clientName,
        uint256 _invoiceIndex
    )
        public
        view
        userOnly(_userAddress, _clientName)
        isValidPassword(_userAddress, _pwd)
        returns (string memory invoiceHash)
    {
        return clientNameInvoicesMap[_clientName][uint256(_invoiceIndex)];
    }
}
