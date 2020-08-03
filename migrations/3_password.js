const Password = artifacts.require("Password");

module.exports = function(deployer) {
  deployer.deploy(Password);
};
