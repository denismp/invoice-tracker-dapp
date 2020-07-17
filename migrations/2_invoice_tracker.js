const InvoiceTracker = artifacts.require("InvoiceTracker");

module.exports = function(deployer) {
  deployer.deploy(InvoiceTracker);
};
