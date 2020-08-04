// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Password.sol";
//import "./Owned.sol";

contract Users is Ownable {
    /// @dev User struct
    struct User {
        string name;
        bytes32 ePwd;
        bool flag;
    }

    /// @dev map the user address to the User struct
    mapping(address => User) public usersMap;
    /// @dev user count
    uint256 userCount = 0;
    /// @dev map the user index to the user address
    mapping(uint256 => address) userIndexMap;

    event addUserEvent(address payable _address, string _name, string _pwd);

    modifier isValidPassword(address _userAddress, string memory _pwd) {
        bytes32 epwd = keccak256(abi.encodePacked(_pwd));
        require(usersMap[_userAddress].ePwd == epwd, "Invalid password given");
        _;
    }

    modifier noDupUser(address _address) {
        require(usersMap[_address].flag == false, "User already exists");
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
}
