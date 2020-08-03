const Password = artifacts.require("Password");
const utils = require("./utils.js");
const truffleAssert = require('truffle-assertions');

contract("Password", async accounts => {
  beforeEach(async () => {
    password = await Password.new();
  });

  it('javascript test calculate password', async () => {
    const result = await password.calcPassword('password');
    console.log(result);
    assert.equal(result, "0xb68fe43f0d1a0d7aef123722670be50268e15365401c442f8806ef83b612976b");
  })
});
