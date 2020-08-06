// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

import "./Users.sol";

contract Clients is Users {
    // /// @dev Client struct
    // struct Client {
    //     address clientID;
    //     string name;
    //     bool flag;
    // }

    /**
     * Clients has a Invoices
     */
    // /// @dev map the name of the client to the Client struct
    // mapping(string => Client) public clientMap;
    // /// @dev map the name of the client to the client address
    // mapping(string => address) public clientNameAddressMap;
    // /// @dev map the user address to the client ID
    // mapping(address => address) public userClientIDMap;
    // /// @dev map the user name to his Clients.
    // mapping(address => Client[]) public usersToClientsMap;
    // /// @dev map the user address to the number of his Clients.
    // mapping(address => int256) public userToNumClientsMap;
    // /// @dev map the client name to the invoice numbers.
    // mapping(string => uint256[]) public clientNameInvoiceNumMap;

    // /// @dev map the clientID address to his invoices
    //mapping(address => Invoice.Invoice[]) public clientIDInvoiceMap;

    event addClientEvent(address _userAddress, address _clientID, string _name);
    // event duplicateClientEvent(address _userAddress, string _clientID);

    // /// @author Denis M. Putnam
    // /// @notice Check for no client.
    // /// @param _clientName name of the client.
    // /// @param _clientID clients wallet address.
    // /// @dev no other details.
    // function isNoClient(
    //     address _userAddress,
    //     string memory _clientName,
    //     address _clientID
    // ) public payable returns (bool) {
    //     if (userClientIDMap[_userAddress] == _clientID) {
    //         emit duplicateClientEvent(_userAddress, _clientName);
    //         return false;
    //     }
    //     return true;
    // }

    // modifier noDupClient(
    //     address _userAddress,
    //     address _clientID,
    //     string memory _clientName
    // ) {
    //     require(
    //         isNoClient(_userAddress, _clientName, _clientID),
    //         "Client already exists for the given user"
    //     );
    //     _;
    // }

    // modifier userOnly(address _userAddress, string memory _clientName) {
    //     address _clientID = clientMap[_clientName].clientID;
    //     require(
    //         userClientIDMap[_userAddress] == _clientID,
    //         "User and client are not related"
    //     );
    //     _;
    // }

    function getClientNameFromMap(string memory name)
        public
        view
        returns (address clientAddress)
    {
        return clientMap[name].clientID;
    }

    function getClientIDFromIDMap(address userAddress)
        public
        view
        onlyOwner()
        returns (address clientID)
    {
        return userClientIDMap[userAddress];
    }

    /// @author Denis M. Putnam
    /// @notice Add a client to this contract.
    /// @param _userAddress user address
    /// @param _pwd plain text user password
    /// @param _clientID address of the wallet of the client.
    /// @param _name string with the client's name.  This needs to be unique
    /// @dev Add's a client to the clientMap and the clientNameAddressMap
    function addClient(
        address _userAddress,
        string memory _pwd,
        address _clientID,
        string memory _name
    )
        public
        userOnly(_userAddress, _name)
        isValidPassword(_userAddress, _pwd)
        noDupClient(_userAddress, _clientID, _name)
    {
        clientMap[_name].clientID = _clientID;
        clientMap[_name].name = _name;
        clientMap[_name].flag = true;

        // clientNameArray.push(_name);
        if (userClientIDMap[_userAddress] == address(0x0)) {
          userClientIDMap[_userAddress] = _clientID;
        }

        clientNameAddressMap[_name] = _clientID;
        //clientNameInvoiceCountMap[_name] = 0;
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
        returns (
            string memory name,
            address clientID
        )
    {
        string memory lname = clientMap[_name].name;
        address lclientID = clientMap[_name].clientID;
        return (lname, lclientID);
    }

    /// @author Denis M. Putnam
    /// @notice get the client by index number.
    /// @param _userAddress user account address.
    /// @param _index index of client name
    /// @dev no further info
    /// @return name
    /// @return clientID
    function getClientByIndex(
        address _userAddress,
        //string memory _pwd,
        uint256 _index
    )
        public
        view
        onlyOwner()
        returns (
            string memory name,
            address clientID
        )
    {
        Client memory _client = usersToClientsMap[_userAddress][_index];
        string memory lname = _client.name;
        address lclientID = _client.clientID;
        return (lname, lclientID);
    }

    function getClientCount(address _userAddress)
        public
        view
        returns (int256 count)
    {
        //return clientNameArray.length;
        return userToNumClientsMap[_userAddress];
    }
}
