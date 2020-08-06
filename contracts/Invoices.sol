// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

//import "@openzeppelin/contracts/access/Ownable.sol";
import "./Password.sol";

/// @title Invoices contract
/// @author Denis M. Putnam
/// @notice This contract handles invoices for payment
/// @dev Use at your own risk.
contract Invoices is Password {
    Invoice newInvoice;

    event duplicateInvoiceEvent(string _clientName, uint256 _invoiceNumber);

    /// @author Denis M. Putnam
    /// @notice Check for no duplicate invoice.
    /// @param _clientName name of the client.
    /// @param _invoiceNumber invoice number.
    /// @dev no other details.
    function isNoDuplicateInvoice(
        string memory _clientName,
        uint256 _invoiceNumber
    ) public payable returns (bool) {
        for (uint256 i = 0; i < clientNameInvoicesCountMap[_clientName]; i++) {
            // if (_invoiceNumber == clientInvoiceMap[_clientName][i]) {
            //     return false;
            // }
            if (
                _invoiceNumber ==
                clientNameInvoicesMap[_clientName][i].invoiceNumber
            ) {
                return false;
            }
        }
        return true;
    }

    // modifier noDupUser(address _address) {
    //     require(usersMap[_address].flag == false, "User already exists");
    //     _;
    // }

    modifier noDupInvoice(string memory _clientName, uint256 _invoiceNumber) {
        bool flag = isNoDuplicateInvoice(_clientName, _invoiceNumber);
        if (flag == false) {
            emit duplicateInvoiceEvent(_clientName, _invoiceNumber);
        }
        require(flag, "Duplicate invoice");
        _;
    }

    modifier isInvoiceNumber(uint256 _invoiceNumber) {
        require(_invoiceNumber > 0, "Invoice number must be greater than 0");
        _;
    }

    event addInvoiceEvent(
        string _clientName,
        uint256 _invoiceNumber,
        uint256 _netTerms,
        uint256 _numberHours,
        string _amount,
        uint256 _timesheetEndDate,
        uint256 _invoiceSentDate,
        uint256 _due30DaysDate,
        uint256 _due60DaysDate,
        uint256 _due90DaysDate,
        uint256 _due120DaysDate,
        uint256 _datePmtReceived
    );

    event updateInvoiceEvent(
        string _clientName,
        uint256 _invoiceNumber,
        uint256 _datePmtReceived
    );

    event addUserEvent(address payable _address, string _name, string _pwd);

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
    /// @param _invoiceNumber invoice number
    /// @param _netTerms net terms for 30, 60, 90, or 120 days.
    /// @param _numberHours number of hours for the timesheet.
    /// @param _amount amount in dollars.
    /// @param _dates array of dates for timesheetEndDate, invoiceSentDate, due30DaysDate, due60DaysDate, due90DaysDate, due120DaysDate
    /// @dev Add's an invoice to be tracked.
    function addInvoice(
        address _userAddress,
        string memory _pwd,
        string memory _clientName,
        uint256 _invoiceNumber,
        uint256 _netTerms,
        uint256 _numberHours,
        string memory _amount,
        uint256[] memory _dates
    )
        public
        userOnly(_userAddress, _clientName)
        isValidPassword(_userAddress, _pwd)
        noDupInvoice(_clientName, _invoiceNumber)
    {
        newInvoice.invoiceNumber = _invoiceNumber;
        newInvoice.netTerms = _netTerms;
        newInvoice.numberHours = _numberHours;
        newInvoice.amount = _amount;
        newInvoice.timesheetEndDate = _dates[0]; // timesheetEndDate
        newInvoice.invoiceSentDate = _dates[1]; // invoiceSentDate
        newInvoice.due30DaysDate = _dates[2]; // due30DaysDate
        newInvoice.due60DaysDate = _dates[3]; // due60DaysDate
        newInvoice.due90DaysDate = _dates[4]; // due90DaysDate
        newInvoice.due120DaysDate = _dates[5]; // due120DaysDate

        clientNameInvoicesMap[_clientName].push(newInvoice);
        clientNameInvoiceNumMap[_clientName].push(_invoiceNumber);

        incremmentInvoiceCount(_clientName);

        emit addInvoiceEvent(
            _clientName,
            newInvoice.invoiceNumber,
            newInvoice.netTerms,
            newInvoice.numberHours,
            newInvoice.amount,
            newInvoice.timesheetEndDate,
            newInvoice.invoiceSentDate,
            newInvoice.due30DaysDate,
            newInvoice.due60DaysDate,
            newInvoice.due90DaysDate,
            newInvoice.due120DaysDate,
            newInvoice.datePmtReceived
        );
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
        returns (
            uint256 count
        )
    {
        count = clientNameInvoicesCountMap[_clientName];
        // count = getInvoiceCount(_clientName);
    }

    /// @author Denis M. Putnam
    /// @notice Get the list of invoice numbers as a string for the given client name.
    /// @param _userAddress user address
    /// @param _pwd plain text user password
    /// @param _clientName name of the client
    /// @dev returned string is a comma separated string of invoice numbers.  The comma is also the end of the string if no other values appear.
    /// @return a comma seperated list of invoice numbers associated with the client.
    function getInvoiceNumbers(
        address _userAddress,
        string memory _pwd,
        string memory _clientName
    )
        public
        view
        userOnly(_userAddress, _clientName)
        isValidPassword(_userAddress, _pwd)
        returns (
            uint256[] memory
        )
    {
        return clientNameInvoiceNumMap[_clientName];
    }

    function findInvoiceIndex(string memory _clientName, uint256 _invoiceNumber)
        private
        view
        isInvoiceNumber(_invoiceNumber)
        returns (int256 index)
    {
        for (
            int256 i = 0;
            i < int256(clientNameInvoicesCountMap[_clientName]);
            i++
        ) {
            //clientNameInvoicesMap
            if (
                _invoiceNumber ==
                clientNameInvoicesMap[_clientName][uint256(i)].invoiceNumber
            ) {
                return i;
            }
        }
        return -1;
    }

    /// @author Denis M. Putnam
    /// @notice Update an invoice with the payment date
    /// @param _userAddress user address
    /// @param _pwd plain text password
    /// @param _clientName name of the client
    /// @param _invoiceNumber invoice number being requested.
    /// @param _invoicePmtDate payment date
    /// @dev no other details
    function updateInvoice(
        address _userAddress,
        string memory _pwd,
        string memory _clientName,
        uint256 _invoiceNumber,
        uint256 _invoicePmtDate
    )
        public
        userOnly(_userAddress, _clientName)
        isValidPassword(_userAddress, _pwd)
    {
        int256 _index = findInvoiceIndex(_clientName, _invoiceNumber);
        if (_index != -1) {
          Invoice memory lInvoice = clientNameInvoicesMap[_clientName][uint256(_index)];
          lInvoice.datePmtReceived = _invoicePmtDate;
          clientNameInvoicesMap[_clientName][uint256(_index)] = lInvoice;
          emit updateInvoiceEvent(
              _clientName,
              _invoiceNumber,
              _invoicePmtDate
          );
        }
    }

    /// @author Denis M. Putnam
    /// @notice Get an invoice
    /// @param _userAddress user address
    /// @param _pwd plain text password
    /// @param _clientName name of the client
    /// @param _invoiceNumber invoice number being requested.
    /// @dev no other details
    /// @return invoiceNumber
    /// @return netTerms
    /// @return numberHours
    /// @return amount
    function getInvoice(
        address _userAddress,
        string memory _pwd,
        string memory _clientName,
        uint256 _invoiceNumber
    )
        public
        view
        userOnly(_userAddress, _clientName)
        isValidPassword(_userAddress, _pwd)
        returns (
            uint256 invoiceNumber,
            uint256 netTerms,
            uint256 numberHours,
            string memory amount
        )
    {
        int256 _index = findInvoiceIndex(_clientName, _invoiceNumber);
        if (_index != -1) {
            Invoice memory lInvoice = clientNameInvoicesMap[_clientName][uint256(_index)];
            return (
                lInvoice.invoiceNumber,
                lInvoice.netTerms,
                lInvoice.numberHours,
                lInvoice.amount
            );
        }
    }

    /// @author Denis M. Putnam
    /// @notice Get an invoice
    /// @param _userAddress user address
    /// @param _pwd plain text password
    /// @param _clientName name of the client
    /// @param _invoiceNumber invoice number being requested.
    /// @dev no other details
    /// @return invoiceNumber
    /// @return timesheetEndDate
    /// @return invoiceSentDate
    /// @return datePmtReceived
    function getInvoiceDates(
        address _userAddress,
        string memory _pwd,
        string memory _clientName,
        uint256 _invoiceNumber
    )
        public
        view
        userOnly(_userAddress, _clientName)
        isValidPassword(_userAddress, _pwd)
        returns (
            uint256 invoiceNumber,
            uint256 timesheetEndDate,
            uint256 invoiceSentDate,
            uint256 datePmtReceived
        )
    {
        int256 _index = findInvoiceIndex(_clientName, _invoiceNumber);
        if (_index != -1) {
          Invoice memory lInvoice = clientNameInvoicesMap[_clientName][uint256(_index)];
          return (
                lInvoice.invoiceNumber,
                lInvoice.timesheetEndDate,
                lInvoice.invoiceSentDate,
                lInvoice.datePmtReceived
          );
        }
    }

    /// @author Denis M. Putnam
    /// @notice Get an invoice
    /// @param _userAddress user address
    /// @param _pwd plain text password
    /// @param _clientName name of the client
    /// @param _invoiceNumber invoice number being requested.
    /// @dev no other details
    /// @return invoiceNumber
    /// @return due30DaysDate
    /// @return due60DaysDate
    /// @return due90DaysDate
    /// @return due120DaysDate
    function getInvoiceDueDates(
        address _userAddress,
        string memory _pwd,
        string memory _clientName,
        uint256 _invoiceNumber
    )
        public
        view
        userOnly(_userAddress, _clientName)
        isValidPassword(_userAddress, _pwd)
        returns (
            uint256 invoiceNumber,
            uint256 due30DaysDate,
            uint256 due60DaysDate,
            uint256 due90DaysDate,
            uint256 due120DaysDate
        )
    {
        int256 _index = findInvoiceIndex(_clientName, _invoiceNumber);
        if (_index != -1) {
          Invoice memory lInvoice = clientNameInvoicesMap[_clientName][uint256(_index)];
          return (
              lInvoice.invoiceNumber,
              lInvoice.due30DaysDate,
              lInvoice.due60DaysDate,
              lInvoice.due90DaysDate,
              lInvoice.due120DaysDate
          );
        }
    }
}
