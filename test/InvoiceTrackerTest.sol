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
    invoiceTracker.addClient(payable(0x9769862B4e59e0F23F495C3c21F4c9a6def307F3),address(0x555), "test");
  }

  function testAddUser() public {
    invoiceTracker.addUser(payable(0x28Fcf7997E56f1Fadd4FA39fD834e5B96cb13b2B), "test", "password");
    invoiceTracker.addUser(payable(0x9769862B4e59e0F23F495C3c21F4c9a6def307F3), "test2", "password");
  }
}
