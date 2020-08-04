const Users = artifacts.require("Users");
const utils = require("./utils.js");
const truffleAssert = require('truffle-assertions');

contract("User", async accounts => {
  let users;
  beforeEach(async () => {
    users = await Users.new();
    const userAccountAddress = "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3";
    const userName = "user1";
    const userPwd = "password";
    //let result = await debug(users.addUser(userAccountAddress, userName, userPwd));
    let result = await users.addUser(userAccountAddress, userName, userPwd);
    truffleAssert.prettyPrintEmittedEvents(result);
  });

  it('javascript test get user', async () => {
    console.log("GET USER");
    let result = await users.getUser("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3");
    //truffleAssert.prettyPrintEmittedEvents(result);
    console.log('result=',result);
    assert.equal(result.name, 'user1');
  });

  it('javascript test get user count', async () => {
    console.log("GET USER COUNT");
    let result = await users.getUserCount();
    console.log('result=',result);
    assert.equal(result, '1');
  });

  it('javascript test get user address by index', async () => {
    console.log("GET USER ADDRESS BY INDEX");
    let result = await users.getUserAddressByIndex(0);
    console.log('result=',result);
    assert.equal(result, '0x9769862B4e59e0F23F495C3c21F4c9a6def307F3');
  });

  it('javascript test get user name', async () => {
    console.log("GET USER NAME");
    let result = await users.getUserName("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3");
    //truffleAssert.prettyPrintEmittedEvents(result);
    console.log('result=',result);
    assert.equal(result, 'user1');
  });

  it('javascript test get user by index', async () => {
    console.log("GET USER BY INDEX");
    let result = await users.getUserAddressByIndex(0);
    //truffleAssert.prettyPrintEmittedEvents(result);
    console.log('result=',result);
    assert.equal(result, '0x9769862B4e59e0F23F495C3c21F4c9a6def307F3');
  });

  it('javascript test duplicate user', async () => {
    console.log("ADD DUPLICTE USER");
    let userAccountAddress = "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3";
    let userName = "user1";
    let userPwd = "password";
    try {
      const result = await users.addUser(userAccountAddress, userName, userPwd);
      console.log(result);
    } catch (err) {
      console.log(err.reason);
      assert.equal(err.reason,"User already exists");
    }
  });
});
