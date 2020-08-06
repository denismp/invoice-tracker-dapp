// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

import "./Users.sol";

contract Clients is Users {

    event addClientEvent(address _userAddress, address _clientID, string _name);

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
        string memory _pwd,
        uint256 _index
    )
        public
        view
        isValidPassword(_userAddress, _pwd)
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
