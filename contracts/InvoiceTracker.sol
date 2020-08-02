// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

//import "./Owned.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Invoice Tracking contract
/// @author Denis M. Putnam
/// @notice This contract tracks invoices for payment
/// @dev Use at your own risk.
contract InvoiceTracker is Ownable {
    /// @dev Invoice struct
    struct Invoice {
        uint256 invoiceNumber;
        uint256 netTerms; // 30, 60 90, 120 days net
        uint256 numberHours;
        string amount;
        uint256 timesheetEndDate;
        uint256 invoiceSentDate;
        uint256 due30DaysDate;
        uint256 due60DaysDate;
        uint256 due90DaysDate;
        uint256 due120DaysDate;
        uint256 datePmtReceived;
    }
    Invoice newInvoice;

    /// @dev Client struct
    struct Client {
        address clientID;
        string name;
        bool flag;
    }

    /// @dev User struct
    struct User {
        string name;
        bytes32 ePwd;
        bool flag;
    }

    /// @dev map the name of the client to the Client struct
    mapping(string => Client) private clientMap;
    /// @dev map the user address to the User struct
    mapping(address => User) private usersMap;
    /// @dev map the user address to the client ID
    mapping(address => address) private userClientIDMap;
    /// @dev user count
    uint256 userCount = 0;
    /// @dev map the user index to the user address
    mapping(uint256 => address) userIndexMap;
    /// @dev map the user name to his Clients.
    mapping(address => Client[]) private usersToClientsMap;
    /// @dev map the user address to the number of his Clients.
    mapping(address => int256) private userToNumClientsMap;

    /// @dev array of client names.
    // string[] private clientNameArray;

    /// @dev map the name of the client to the client address
    mapping(string => address) private clientNameAddressMap;
    /// @dev map the name of the client to invoices. this isa one to many mapping.
    mapping(string => Invoice[]) private clientNameInvoiceMap;
    /// @dev map the client name to the invoice numbers.
    mapping(string => uint256[]) private clientNameInvoiceNumMap;
    /// @dev map the name of the client to an invoice count
    mapping(string => uint256) private clientNameInvoiceCountMap;

    /// @author Denis M. Putnam
    /// @notice The constructor for this contract
    /// @dev no other details
    constructor() public payable Ownable() {}

    event addClientEvent(address _userAddress, address _clientID, string _name);
    event duplicateInvoiceEvent(string _clientName, uint256 _invoiceNumber);
    event duplicateClientEvent(address _userAddress, string _clientID);
    event addUserEvent(address payable _address, string _name, string _pwd);

    /// @author Denis M. Putnam
    /// @notice Check for no client.
    /// @param _clientName name of the client.
    /// @param _clientID clients wallet address.
    /// @dev no other details.
    function isNoClient(
        address _userAddress,
        string memory _clientName,
        address _clientID
    ) public payable returns (bool) {
        if (
            clientNameAddressMap[_clientName] == _clientID &&
            userClientIDMap[_userAddress] == _clientID
        ) {
            emit duplicateClientEvent(_userAddress, _clientName);
            return false;
        }
        return true;
    }

    modifier noDupClient(
        address _userAddress,
        address _clientID,
        string memory _clientName
    ) {
        require(
            isNoClient(_userAddress, _clientName, _clientID),
            "Client already exists for the given user"
        );
        _;
    }

    /// @author Denis M. Putnam
    /// @notice Add a client to this contract.
    /// @param _userAddress user address
    /// @param _clientID address of the wallet of the client.
    /// @param _name string with the client's name.  This needs to be unique
    /// @dev Add's a client to the clientMap and the clientNameAddressMap
    function addClient(
        address _userAddress,
        address _clientID,
        string memory _name
    ) public noDupClient(_userAddress, _clientID, _name) {
        clientMap[_name].clientID = _clientID;
        clientMap[_name].name = _name;
        clientMap[_name].flag = true;

        // clientNameArray.push(_name);

        clientNameAddressMap[_name] = _clientID;
        clientNameInvoiceCountMap[_name] = 0;
        userClientIDMap[_userAddress] = _clientID;
        usersToClientsMap[_userAddress].push(Client(_clientID, _name, true));
        userToNumClientsMap[_userAddress] += 1;
        emit addClientEvent(_userAddress, _clientID, _name);
    }

    /// @author Denis M. Putnam
    /// @notice Get the requested client
    /// @param _userAddress user address
    /// @param _pwd plain text password
    /// @param _name client's name
    /// @dev Get the client for the given name.
    /// @return name
    /// @return clientID
    function getClientByName(
        address _userAddress,
        string memory _pwd,
        string memory _name
    )
        public
        view
        userOnly(_userAddress, _name)
        isValidPassword(_userAddress, _pwd)
        returns (string memory name, address clientID)
    {
        string memory lname = clientMap[_name].name;
        address lclientID = clientMap[_name].clientID;
        return (lname, lclientID);
    }

    /// @author Denis M. Putnam
    /// @notice get the client by index number.
    /// @param _index index of client name
    /// @dev no further info
    /// @return name
    /// @return clientID
    function getClientByIndex(address _userAddress, string memory _pwd, uint256 _index)
        public
        view
        isValidPassword(_userAddress, _pwd)
        returns (string memory name, address clientID)
    {
        Client memory _client = usersToClientsMap[_userAddress][_index];
        string memory lname = _client.name;
        address lclientID = _client.clientID;
        return (lname, lclientID);
    }

    modifier noDupUser(address _address) {
        require(usersMap[_address].flag == false, "User already exists");
        _;
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
    /// @notice Get the user name
    /// @param _userAddress user address
    /// @dev Get the client for the given name.
    /// @return name
    function getUserName(address _userAddress)
        public
        view
        returns (string memory name)
    {
        return usersMap[_userAddress].name;
    }

    /// @author Denis M. Putnam
    /// @notice Get the user name and epassword
    /// @param _userAddress user address
    /// @dev Get the client for the given name.
    /// @return name
    /// @return ePwd
    function getUser(address _userAddress)
        public
        view
        returns (string memory name, bytes32 ePwd)
    {
        return (usersMap[_userAddress].name, usersMap[_userAddress].ePwd);
    }

    /// @author Denis M. Putnam
    /// @notice Get the count of users.
    /// @return usercount
    /// @dev no other details.
    function getUserCount()
        public
        view
        onlyOwner()
        returns (uint256 usercount)
    {
        return userCount;
    }

    /// @author Denis M. Putnam
    /// @notice Get the user address
    /// @param _index index of the user
    /// @return _userAddress
    /// @dev no other details.
    function getUserAddressByIndex(uint256 _index)
        public
        view
        onlyOwner()
        returns (address _userAddress)
    {
        return (userIndexMap[_index]);
    }

    function getClientCount(address _userAddress)
        public
        view
        returns (int256 count)
    {
        //return clientNameArray.length;
        return userToNumClientsMap[_userAddress];
    }

    /// @author Denis M. Putnam
    /// @notice Check for no duplicate invoice.
    /// @param _clientName name of the client.
    /// @param _invoiceNumber invoice number.
    /// @dev no other details.
    function isNoDuplicateInvoice(
        string memory _clientName,
        uint256 _invoiceNumber
    ) public payable returns (bool) {
        for (uint256 i = 0; i < clientNameInvoiceCountMap[_clientName]; i++) {
            // if (_invoiceNumber == clientInvoiceMap[_clientName][i]) {
            //     return false;
            // }
            if (
                _invoiceNumber ==
                clientNameInvoiceMap[_clientName][i].invoiceNumber
            ) {
                return false;
            }
        }
        return true;
    }

    modifier noDupInvoice(string memory _clientName, uint256 _invoiceNumber) {
        bool flag = isNoDuplicateInvoice(_clientName, _invoiceNumber);
        if (flag == false) {
            emit duplicateInvoiceEvent(_clientName, _invoiceNumber);
        }
        require(flag, "Duplicate invoice");
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

    modifier userOnly(address _userAddress, string memory _clientName) {
        address _clientID = clientMap[_clientName].clientID;
        require(
            userClientIDMap[_userAddress] == _clientID,
            "User and client are not related"
        );
        _;
    }

    modifier isValidPassword(address _userAddress, string memory _pwd) {
        bytes32 epwd = keccak256(abi.encodePacked(_pwd));
        require(
            usersMap[_userAddress].ePwd == epwd,
            "Invalid password given"
        );
        _;
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
        //Invoice storage newInvoice;

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

        clientNameInvoiceMap[_clientName].push(newInvoice);
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
        return clientNameInvoiceCountMap[_clientName] += 1;
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
        count = clientNameInvoiceCountMap[_clientName];
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
        returns (uint256[] memory)
    {
        return clientNameInvoiceNumMap[_clientName];
    }

    modifier isInvoiceNumber(uint256 _invoiceNumber) {
        require(_invoiceNumber > 0, "Invoice number must be greater than 0");
        _;
    }

    function findInvoiceIndex(string memory _clientName, uint256 _invoiceNumber)
        private
        view
        isInvoiceNumber(_invoiceNumber)
        returns (int256 index)
    {
        for (
            int256 i = 0;
            i < int256(clientNameInvoiceCountMap[_clientName]);
            i++
        ) {
            //clientNameInvoiceMap
            if (
                _invoiceNumber ==
                clientNameInvoiceMap[_clientName][uint256(i)].invoiceNumber
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
            Invoice memory lInvoice = clientNameInvoiceMap[_clientName][uint256(
                _index
            )];
            lInvoice.datePmtReceived = _invoicePmtDate;
            clientNameInvoiceMap[_clientName][uint256(_index)] = lInvoice;
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
            Invoice memory lInvoice = clientNameInvoiceMap[_clientName][uint256(
                _index
            )];
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
            Invoice memory lInvoice = clientNameInvoiceMap[_clientName][uint256(
                _index
            )];
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
            Invoice memory lInvoice = clientNameInvoiceMap[_clientName][uint256(
                _index
            )];
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
