// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";

//import "./Owned.sol";

/// @title Passord contract
/// @author Denis M. Putnam
/// @notice This contract calculate the encrypted password.
/// @dev Use at your own risk.
contract InvoiceData is Ownable {
    /// @dev User struct
    struct User {
        string name;
        bytes32 ePwd;
        bool flag;
    }
    /// @dev Client struct
    struct Client {
        address clientID;
        string name;
        bool flag;
    }

    /// @dev map the user address to the User struct
    mapping(address => User) public usersMap;
    /// @dev user count
    uint256 userCount = 0;
    /// @dev map the user index to the user address
    mapping(uint256 => address) userIndexMap;
    /// @dev map the name of the client to invoices. this isa one to many mapping. Each invoice is hash value of the the invoice data.
    mapping(string => string[]) public clientNameInvoicesMap;
    /// @dev map the client name to the invoice numbers.
    mapping(string => uint256[]) public clientNameInvoiceNumMap;
    /// @dev map the name of the client to an invoice count
    mapping(string => uint256) public clientNameInvoicesCountMap;
    /// @dev map the user address to the client ID
    mapping(address => address) public userClientIDMap;
    /// @dev map the name of the client to the Client struct
    mapping(string => Client) public clientMap;
    /// @dev map the name of the client to the client address
    mapping(string => address) public clientNameAddressMap;
    /// @dev map the user name to his Clients.
    mapping(address => Client[]) public usersToClientsMap;
    /// @dev map the user address to the number of his Clients.
    mapping(address => int256) public userToNumClientsMap;

    modifier isValidPassword(address _userAddress, string memory _pwd) {
        bytes32 epwd = keccak256(abi.encodePacked(_pwd));
        require(usersMap[_userAddress].ePwd == epwd, "Invalid password given");
        _;
    }

    modifier noDupUser(address _address) {
        require(usersMap[_address].flag == false, "User already exists");
        _;
    }

    event duplicateClientEvent(address _userAddress, string _clientID);

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
        if (userClientIDMap[_userAddress] == _clientID) {
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

    modifier userOnly(address _userAddress, string memory _clientName) {
        address _clientID = clientMap[_clientName].clientID;
        require(
            userClientIDMap[_userAddress] == _clientID,
            "User and client are not related"
        );
        _;
    }

    function isPasswordValid(address _userAddress, string memory _pwd)
        public
        view
        returns (bool)
    {
        bytes32 epwd = keccak256(abi.encodePacked(_pwd));
        return (usersMap[_userAddress].ePwd == epwd);
    }

    /// @author Denis M. Putnam
    /// @notice calculate the encrypted password from the given one
    /// @param _pwd plain text password
    /// @return ePwd
    /// @dev no other details.
    function calcPassword(string memory _pwd)
        public
        pure
        returns (bytes32 ePwd)
    {
        return keccak256(abi.encodePacked(_pwd));
    }
}
