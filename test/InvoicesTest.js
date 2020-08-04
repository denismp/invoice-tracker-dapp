const Invoices = artifacts.require("Invoices");
const Clients = artifacts.require("Clients");
const utils = require("./utils.js");
const truffleAssert = require('truffle-assertions');

require('@openzeppelin/test-helpers/configure')({
  provider: 'http://localhost:8555',
});

//const { time, expectEvent } = require('@openzeppelin/test-helpers');

contract("Invoices", async accounts => {

  let invoices;
  let clients;
  beforeEach(async () => {
    invoices = await Invoices.new();
    clients = await Clients.new();
    const userAccountAddress = "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3";
    const userName = "user1";
    const userPwd = "password";
    //let result = await debug(invoices.addUser(userAccountAddress, userName, userPwd));
    let result = await invoices.addUser(userAccountAddress, userName, userPwd);
    truffleAssert.prettyPrintEmittedEvents(result);
  });

  it('javascript test add an invoice', async () => {
    const count = await addInvoice(1);
    assert.equal(count, 1);
    result = await invoices.getInvoiceNumbers("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password","client1");
    console.log("GET INVOICE NUMBERS: invoice numbers=" + result)
  });

  it('javascript test get invoice numbers', async () => {
    console.log("GET INVOICE NUMBERS");
    let count = await addInvoice(1);
    assert.equal(count, 1);
    count = await addInvoice(2);
    assert.equal(count, 2);
    //const result = await debug(invoices.getInvoiceNumbers("test"));
    const result = await invoices.getInvoiceNumbers("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password","client1");
    console.log("GET INVOICE NUMBERS: invoice numbers=" + result);
  });

  it('javascript test get invoice', async () => {
    let count = await addInvoice(1);
    console.log('count=',count);
    assert.equal(count, 1);
    //const result = await debug(invoices.getInvoice("test", 1));
    let result = await invoices.getInvoice("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password", "client1", 1);
    console.log("GET INVOICE");
    console.log("invoice number=" + result.invoiceNumber);
    console.log("invoice netTerms=" + result.netTerms);
    console.log("invoice amount=" + result.amount);
    assert.equal(result.invoiceNumber, 1);
    assert.equal(result.netTerms, 30);
    result = await invoices.getInvoiceDates("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password", "client1", 1);
    assert.equal(result.invoiceNumber, 1);
    console.log("invoice timesheetEndDate=" + result.timesheetEndDate);
    console.log("invoice invoiceSentDate=" + result.invoiceSentDate);
    console.log("invoice invoicePmtDate=" + result.datePmtReceived);
    result = await invoices.getInvoiceDueDates("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password", "client1", 1);
    console.log("invoice due30DaysDate=" + result.due30DaysDate);
    console.log("invoice due60DaysDate=" + result.due60DaysDate);
    console.log("invoice due90DaysDate=" + result.due90DaysDate);
    console.log("invoice due120DaysDate=" + result.due120DaysDate);
    assert.equal(result.invoiceNumber, 1);
  });

  it('javascript test update invoice', async () => {
    let count = await addInvoice(1);
    assert.equal(count, 1);
    //const result = await debug(invoices.getInvoice("test", 1));
    const now = Math.floor((new Date()).getTime() / 1000) + 100;
    console.log("UPDATE INVOICE");
    let result = await invoices.updateInvoice("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password","client1", 1, now);
    truffleAssert.prettyPrintEmittedEvents(result);
    result = await invoices.getInvoiceDates("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password","client1", 1);
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
      const result = await invoices.addInvoice(
        "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3",
        "password",
        "client1",
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
    const result = await invoices.addInvoice(
      "0x9769862B4e59e0F23F495C3c21F4c9a6def307F3",
      "password",
      "client1",
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
      return event._clientName === "client1" &&
        parseInt(event._invoiceNumber) === _invoiceNumber &&
        parseInt(event._netTerms) === 30 &&
        parseInt(event._numberHours) === 80 &&
        event._amount === "2000.50"
        ;
    });
    console.log('DEBUG Just before getInvoiceCount().')
    const count = await invoices.getInvoiceCount("0x9769862B4e59e0F23F495C3c21F4c9a6def307F3","password","client1");
    console.log("Invoice count=" + count);
    return count;
  }
});
