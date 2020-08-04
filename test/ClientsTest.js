const Clients = artifacts.require("Clients");
const utils = require("./utils.js");
const truffleAssert = require('truffle-assertions');

contract("User", async accounts => {
  let clients;
  beforeEach(async () => {
    clients = await Clients.new();
    const userAccountAddress = "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3";
    const userName = "user1";
    const userPwd = "password";
    //let result = await debug(clients.addUser(userAccountAddress, userName, userPwd));
    let result = await clients.addUser(userAccountAddress, userName, userPwd);
    truffleAssert.prettyPrintEmittedEvents(result);
  });

  it('javascript test get user', async () => {
    console.log("GET USER");
    let result = await clients.getUser("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3");
    //truffleAssert.prettyPrintEmittedEvents(result);
    console.log('result=',result);
    assert.equal(result.name, 'user1');
  });

  it('javascript test get user count', async () => {
    console.log("GET USER COUNT");
    let result = await clients.getUserCount();
    console.log('result=',result);
    assert.equal(result, '1');
  });

  it('javascript test get user address by index', async () => {
    console.log("GET USER ADDRESS BY INDEX");
    let result = await clients.getUserAddressByIndex(0);
    console.log('result=',result);
    assert.equal(result, '0x9769862B4e59e0F23F495C3c21F4c9a6def307F3');
  });

  it('javascript test get user name', async () => {
    console.log("GET USER NAME");
    let result = await clients.getUserName("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3");
    //truffleAssert.prettyPrintEmittedEvents(result);
    console.log('result=',result);
    assert.equal(result, 'user1');
  });

  it('javascript test get user by index', async () => {
    console.log("GET USER BY INDEX");
    let result = await clients.getUserAddressByIndex(0);
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
      const result = await clients.addUser(userAccountAddress, userName, userPwd);
      console.log(result);
    } catch (err) {
      console.log(err.reason);
      assert.equal(err.reason,"User already exists");
    }
  });

  it('javascript test add client', async () => {
    console.log("ADD CLIENT");
    let clientID = "0x874390a3787ef36bcd255de00f47f2dc34f70d95";
    let clientName = "client1";
    let userPwd = "password";
    try {
      const result = await clients.addClient("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3", userPwd, clientID, clientName);
    } catch (err) {
      console.log(err.reason);
      assert.equal(err.reason,"Client already exists for the given user");
    }
  });

  it('javascript test duplicate client', async () => {
    console.log("DUPLICATE CLIENT");
    let clientID = "0x874390a3787ef36bcd255de00f47f2dc34f70d95";
    let clientName = "client1";
    let userPwd = "password";
    try {
      let result = await clients.addClient("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3", userPwd, clientID, clientName);
      result = await clients.addClient("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3", userPwd, clientID, clientName);
    } catch (err) {
      console.log(err.reason);
      assert.equal(err.reason,"Client already exists for the given user");
    }
  });

  it('javascript test get client by index', async () => {
    console.log("GET CLIENT BY INDEX");
    let clientID = "0x874390a3787ef36bcd255de00f47f2dc34f70d95";
    let clientName = "client1";
    let userPwd = "password";
    let result = await clients.addClient("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3", userPwd, clientID, clientName);
    result = await clients.getClientByIndex("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3",0);
    console.log('result=',result);
    //truffleAssert.prettyPrintEmittedEvents(result);
    //assert.equal(result.name, 'test');
  });

});
