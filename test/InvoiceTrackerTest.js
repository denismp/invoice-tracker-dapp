const InvoiceTracker = artifacts.require("InvoiceTracker");
const utils = require("./utils.js");
const truffleAssert = require('truffle-assertions');

contract("InvoiceTracker", async accounts => {

  let invoiceTracker;
  beforeEach(async () => {
    invoiceTracker = await InvoiceTracker.new();
    let userAccountAddress = "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3";
    let userName = "user1";
    let userPwd = "password";
    let result = await debug(invoiceTracker.addUser(userAccountAddress, userName, userPwd));
    truffleAssert.prettyPrintEmittedEvents(result);
    let clientID = "0x874390a3787ef36bcd255de00f47f2dc34f70d95";
    let clientName = "test";
    result = await invoiceTracker.addClient(userAccountAddres, clientID, clientName);
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
    const result = await invoiceTracker.getInvoiceNumbers("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","test");
    console.log("GET INVOICE NUMBERS: invoice numbers=" + result);
  });

  it.skip('javascript test get invoice', async () => {
    let count = await addInvoice(1);
    assert.equal(count, 1);
    //const result = await debug(invoiceTracker.getInvoice("test", 1));
    const result = await invoiceTracker.getInvoice("test", 1);
    console.log("GET INVOICE");
    console.log("invoice number=" + result.invoiceNumber);
    console.log("invoice netTerms=" + result.netTerms);
    console.log("invoice amount=" + result.amount);
    console.log("invoice invoicePmtDate=" + result.datePmtReceived);
    console.log("invoice timesheetEndDate=" + result.timesheetEndDate);
    assert.equal(result.invoiceNumber, 1);
    assert.equal(result.netTerms, 30);
  });

  it.skip('javascript test update invoice', async () => {
    let count = await addInvoice(1);
    assert.equal(count, 1);
    //const result = await debug(invoiceTracker.getInvoice("test", 1));
    const now = Math.floor((new Date()).getTime() / 1000) + 100;
    console.log("UPDATE INVOICE");
    let result = await invoiceTracker.updateInvoice("test", 1, now);
    truffleAssert.prettyPrintEmittedEvents(result);
    result = await invoiceTracker.getInvoice("test", 1);
    console.log("updated invoice number=" + result.invoiceNumber);
    console.log("update invoice netTerms=" + result.netTerms);
    console.log("updated invoice invoicePmtDate=" + result.datePmtReceived);
    console.log("updated now=" + now);
    assert.equal(result.datePmtReceived, now);
  });

  // it('javascript test get client', async () => {
  //   console.log("GET CLIENT");
  //   let result = await invoiceTracker.getClientByIndex(0);
  //   console.log('result=',result);
  //   //truffleAssert.prettyPrintEmittedEvents(result);
  //   assert.equal(result.name, 'test');
  // });

  async function addInvoice(_invoiceNumber) {
    const now = Math.floor((new Date()).getTime() / 1000);
    console.log("ADD INVOICE");
    console.log("Adding invoice number=" + _invoiceNumber);
    const result = await invoiceTracker.addInvoice(
      "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3",
      "test",
      _invoiceNumber,
      30,
      80,
      "2000.50",
      now,
      now,
      now,
      now,
      now,
      now
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
    const count = await invoiceTracker.getInvoiceCount("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","test");
    console.log("Invoice count=" + count);
    return count;
  }
});
