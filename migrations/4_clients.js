const Clients = artifacts.require("Clients");

module.exports = function(deployer) {
  deployer.deploy(Clients);
};
