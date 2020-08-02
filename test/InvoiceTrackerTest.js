const InvoiceTracker = artifacts.require("InvoiceTracker");
const utils = require("./utils.js");
const truffleAssert = require('truffle-assertions');

require('@openzeppelin/test-helpers/configure')({
  provider: 'http://localhost:8555',
});

//const { time, expectEvent } = require('@openzeppelin/test-helpers');

contract("InvoiceTracker", async accounts => {

  let invoiceTracker;
  beforeEach(async () => {
    invoiceTracker = await InvoiceTracker.new();
    let userAccountAddress = "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3";
    let userName = "user1";
    let userPwd = "password";
    //let result = await debug(invoiceTracker.addUser(userAccountAddress, userName, userPwd));
    let result = await invoiceTracker.addUser(userAccountAddress, userName, userPwd);
    truffleAssert.prettyPrintEmittedEvents(result);
    let clientID = "0x874390a3787ef36bcd255de00f47f2dc34f70d95";
    let clientName = "test";
    result = await invoiceTracker.addClient(userAccountAddress, clientID, clientName);
    truffleAssert.prettyPrintEmittedEvents(result);
    truffleAssert.eventEmitted(result, 'addClientEvent', (event) => {
      console.log("event._clientID=" + event._clientID.toUpperCase());
      console.log("       clientID=" + clientID.toUpperCase());
      const myequal = event._clientID.toUpperCase() === clientID.toUpperCase();
      console.log("DEBUG:" + myequal);
      return event._clientID.toUpperCase() == clientID.toUpperCase() && event._name === "test";
    });
  });

  // it('javascript test add an invoice', async () => {
  //   const count = await addInvoice(1);
  //   assert.equal(count, 1);
  // });

  it('javascript test get invoice numbers', async () => {
    console.log("GET INVOICE NUMBERS");
    let count = await addInvoice(1);
    assert.equal(count, 1);
    count = await addInvoice(2);
    assert.equal(count, 2);
    //const result = await debug(invoiceTracker.getInvoiceNumbers("test"));
    const result = await invoiceTracker.getInvoiceNumbers("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password","test");
    console.log("GET INVOICE NUMBERS: invoice numbers=" + result);
  });

  it('javascript test get invoice', async () => {
    let count = await addInvoice(1);
    assert.equal(count, 1);
    //const result = await debug(invoiceTracker.getInvoice("test", 1));
    let result = await invoiceTracker.getInvoice("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password", "test", 1);
    console.log("GET INVOICE");
    console.log("invoice number=" + result.invoiceNumber);
    console.log("invoice netTerms=" + result.netTerms);
    console.log("invoice amount=" + result.amount);
    assert.equal(result.invoiceNumber, 1);
    assert.equal(result.netTerms, 30);
    result = await invoiceTracker.getInvoiceDates("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password", "test", 1);
    assert.equal(result.invoiceNumber, 1);
    console.log("invoice timesheetEndDate=" + result.timesheetEndDate);
    console.log("invoice invoiceSentDate=" + result.invoiceSentDate);
    console.log("invoice invoicePmtDate=" + result.datePmtReceived);
    result = await invoiceTracker.getInvoiceDueDates("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password", "test", 1);
    console.log("invoice due30DaysDate=" + result.due30DaysDate);
    console.log("invoice due60DaysDate=" + result.due60DaysDate);
    console.log("invoice due90DaysDate=" + result.due90DaysDate);
    console.log("invoice due120DaysDate=" + result.due120DaysDate);
    assert.equal(result.invoiceNumber, 1);
  });

  it('javascript test update invoice', async () => {
    let count = await addInvoice(1);
    assert.equal(count, 1);
    //const result = await debug(invoiceTracker.getInvoice("test", 1));
    const now = Math.floor((new Date()).getTime() / 1000) + 100;
    console.log("UPDATE INVOICE");
    let result = await invoiceTracker.updateInvoice("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password","test", 1, now);
    truffleAssert.prettyPrintEmittedEvents(result);
    result = await invoiceTracker.getInvoiceDates("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password","test", 1);
    assert.equal(result.invoiceNumber, 1);
    assert.equal(result.datePmtReceived, now);
    console.log("updated invoice number=" + result.invoiceNumber);
    console.log("updated invoice invoicePmtDate=" + result.datePmtReceived);
    console.log("updated now=" + now);
  });

  it('javascript test duplicate invoice', async () => {
    let count = await addInvoice(1);
    assert.equal(count, 1);
    const now = Math.floor((new Date()).getTime() / 1000);
    const _dates = [];
    _dates[0] = now;
    _dates[1] = now;
    _dates[2] = now;
    _dates[3] = now;
    _dates[4] = now;
    _dates[5] = now;
    try {
      const result = await invoiceTracker.addInvoice(
        "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3",
        "password",
        "test",
        1,
        30,
        80,
        "2000.50",
        _dates
      );
    } catch (err) {
      console.log(err.reason);
      assert.equal(err.reason,"Duplicate invoice");
    }
  });

  it('javascript test get client by index', async () => {
    console.log("GET CLIENT BY INDEX");
    let result = await invoiceTracker.getClientByIndex("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password",0);
    console.log('result=',result);
    //truffleAssert.prettyPrintEmittedEvents(result);
    assert.equal(result.name, 'test');
  });

  it('javascript test duplicate client', async () => {
    console.log("DUPLICATE CLIENT");
    let clientID = "0x874390a3787ef36bcd255de00f47f2dc34f70d95";
    let clientName = "test";
    try {
      const result = await invoiceTracker.addClient("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3", clientID, clientName);
    } catch (err) {
      console.log(err.reason);
      assert.equal(err.reason,"Client already exists for the given user");
    }
  });

  it('javascript test get user count', async () => {
    console.log("GET USER COUNT");
    let result = await invoiceTracker.getUserCount();
    console.log('result=',result);
    assert.equal(result, '1');
  });

  it('javascript test get user address by index', async () => {
    console.log("GET USER ADDRESS BY INDEX");
    let result = await invoiceTracker.getUserAddressByIndex(0);
    console.log('result=',result);
    assert.equal(result, '0x9769862B4e59e0F23F495C3c21F4c9a6def307F3');
  });

  it('javascript test get user', async () => {
    console.log("GET USER");
    let result = await invoiceTracker.getUser("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3");
    //truffleAssert.prettyPrintEmittedEvents(result);
    console.log('result=',result);
    assert.equal(result.name, 'user1');
  });

  it('javascript test get user name', async () => {
    console.log("GET USER NAME");
    let result = await invoiceTracker.getUserName("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3");
    //truffleAssert.prettyPrintEmittedEvents(result);
    console.log('result=',result);
    assert.equal(result, 'user1');
  });

  it('javascript test get user by index', async () => {
    console.log("GET USER BY INDEX");
    let result = await invoiceTracker.getUserAddressByIndex(0);
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
      const result = await invoiceTracker.addUser(userAccountAddress, userName, userPwd);
      console.log(result);
    } catch (err) {
      console.log(err.reason);
      assert.equal(err.reason,"User already exists");
    }
  });

  async function addInvoice(_invoiceNumber) {
    const now = Math.floor((new Date()).getTime() / 1000);
    console.log("ADD INVOICE");
    console.log("Adding invoice number=" + _invoiceNumber);
    const _dates = [];
    _dates[0] = now;
    _dates[1] = now;
    _dates[2] = now;
    _dates[3] = now;
    _dates[4] = now;
    _dates[5] = now;
    const result = await invoiceTracker.addInvoice(
      "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3",
      "password",
      "test",
      _invoiceNumber,
      30,
      80,
      "2000.50",
      _dates
    );
    truffleAssert.prettyPrintEmittedEvents(result);
    truffleAssert.eventEmitted(result, 'addInvoiceEvent', (event) => {
      console.log("event._invoiceNumber=" + event._invoiceNumber);
      // console.log("       clientID=" + clientID.toUpperCase());
      const myequal = parseInt(event._invoiceNumber) === _invoiceNumber;
      console.log("DEBUG:" + myequal);
      return event._clientName === "test" &&
        parseInt(event._invoiceNumber) === _invoiceNumber &&
        parseInt(event._netTerms) === 30 &&
        parseInt(event._numberHours) === 80 &&
        event._amount === "2000.50"
        ;
    });
    const count = await invoiceTracker.getInvoiceCount("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password","test");
    console.log("Invoice count=" + count);
    return count;
  }
});
