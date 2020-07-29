// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.6;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/InvoiceTracker.sol";

contract InvoiceTrackerTest {
  InvoiceTracker invoiceTracker;

  function beforeEach() public {
    invoiceTracker = new InvoiceTracker();
  }
  function testSettingOwnerAnOwnerDuringCreations() public {
    //InvoiceTracker invoiceTracker = new InvoiceTracker();
    Assert.equal(invoiceTracker.getCurrentOwner(), address(this), "The owner is different from the deployer");
  }

  function testAddClient() public {
    invoiceTracker.addClient(address(0x555), "test");
  }
}
