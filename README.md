# InvoiceDapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Initial setup

### Add angular material

ng add @angular/material

###  Add flex-layout
npm i @angular/flex-layout@9.0.0-beta.31

### Angular material schematics
`https://material.angular.io/guide/schematics`

#### Angular material schematics - Add navigation
ng generate @angular/material:navigation <component-name>

#### Angular material schmematics - Add form
ng generate @angular/material:address-form <component-name>

#### Angular material schematics - Add table
ng generate @angular/material:table <component-name>

### Solidity setup
truffle init

## heroku deployment
`https://devcenter.heroku.com/categories/nodejs-support`

## Truffle set up.
0. Make sure you run these two commands: (https://github.com/trufflesuite/truffle/issues/2070) otherwise you will get failures for test in truffle console.
    npm un -g truffle
    npm i -g truffle@nodeLTS

    The version should look like:
      /Users/username>truffle version
      Truffle v5.1.17 (core: 5.1.17)
      Solidity v0.5.16 (solc-js)
      Node v10.20.1
      Web3.js v1.2.1

1. Run truffle init in the home directory.  This will create the truffle-config.js file and the contracts/ and 
migrations/ directories and their contents.  This is too set up local truffle testing for the solidity contract.
2. Edit the truffle-config.js file and make sure these entries are uncommented:
    development: {
        host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
        port: 7545,            // Standard Ethereum port (default: none)
        network_id: "*",       // Any network (default: none)
    }

      compilers: {
    solc: {
      version: "0.6.6",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
3. Open a terminal window and run "truffle development" to get access to the truffle console.    
4. run "npm install truffle-assertions" for the truffleAssert calls in testing

# Run truffle
truffle development

## Useful truffle commands
truffle migrate --reset network development
truffle migrate --reset network ropsten

# Run remixd
remixd -s /Users/denisputnam/git/invoice-tracker-dapp --remix-ide http://remix.ethereum.org
`import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol"`

http://remix.ethereum.org/#optimize=false&evmVersion=null&version=soljson-v0.6.6+commit.6c089d02.js

# Ganache
## Install client
https://github.com/trufflesuite/ganache-cli

npm install -g ganache-cli

## Run ganache-cli
ganache-cli
ganache-cli -l 8000000
ganache-cli -l 0x1fffffffffffff


## Generate documentation
1. run "solc --userdoc --devdoc contracts/InvoiceTracker.sol" as an example.

======= contracts/InvoiceTracker.sol:InvoiceTracker =======
Developer Documentation
{
  "author": "Denis M. Putnam",
  "details": "Use at your own risk.",
  "methods":
  {
    "addClient(address,string)":
    {
      "author": "Denis M. Putnam",
      "details": "Add's a client to the clientMap and the clientNameAddressMap",
      "params":
      {
        "_clientID": "address of the wallet of the client.",
        "_name": "string with the client's name.  This needs to be unique"
      }
    },
    "addInvoice(string,uint256,uint256,uint256,string,uint256,uint256,uint256,uint256,uint256,uint256)":
    {
      "author": "Denis M. Putnam",
      "details": "Add's an invoice to be tracked.",
      "params":
      {
        "_amount": "amount in dollars.",
        "_clientName": "name of the client",
        "_due120DaysDate": "120 day invoice due date",
        "_due30DaysDate": "30 day invoice due date",
        "_due60DaysDate": "60 day invoice due date",
        "_due90DaysDate": "90 day invoice due date",
        "_invoiceNumber": "invoice number",
        "_invoiceSentDate": "date that invoice was sent to the client.",
        "_netTerms": "net terms for 30, 60, 90, or 120 days.",
        "_numberHours": "number of hours for the timesheet.",
        "_timesheetEndDate": "timesheet end date"
      }
    },
    "changeOwner(address)":
    {
      "author": "Denis M. Putnam",
      "details": "No other details.",
      "params":
      {
        "newOwner": "new address payable owner."
      }
    },
    "constructor":
    {
      "author": "Denis M. Putnam",
      "details": "no other details"
    },
    "getClientByIndex(uint256)":
    {
      "author": "Denis M. Putnam",
      "details": "no further info",
      "params":
      {
        "_index": "index of client name"
      },
      "returns":
      {
        "clientID": "clientID",
        "name": "name"
      }
    },
    "getClientByName(string)":
    {
      "author": "Denis M. Putnam",
      "details": "Get the client for the given name.",
      "params":
      {
        "_name": "client's name"
      },
      "returns":
      {
        "clientID": "clientID",
        "name": "name"
      }
    },
    "getCurrentOwner()":
    {
      "author": "Denis M. Putnam",
      "details": "No other details.",
      "returns":
      {
        "_0": "address current owner."
      }
    },
    "getInvoice(string,uint256)":
    {
      "author": "Denis M. Putnam",
      "details": "no other details",
      "params":
      {
        "_clientName": "name of the client",
        "_invoiceNumber": "invoice number being requested."
      },
      "returns":
      {
        "amount": "amount",
        "datePmtReceived": "datePmtReceived",
        "due120DaysDate": "due120DaysDate",
        "due30DaysDate": "due30DaysDate",
        "due60DaysDate": "due60DaysDate",
        "due90DaysDate": "due90DaysDate",
        "invoiceNumber": "invoiceNumber",
        "invoiceSentDate": "invoiceSentDate",
        "netTerms": "netTerms",
        "numberHours": "numberHours",
        "timesheetEndDate": "timesheetEndDate"
      }
    },
    "getInvoiceCount(string)":
    {
      "author": "Denis M. Putnam",
      "details": "no other details.",
      "params":
      {
        "_clientName": "name of the client"
      },
      "returns":
      {
        "count": "of invoices associated with the given client"
      }
    },
    "getInvoiceNumbers(string)":
    {
      "author": "Denis M. Putnam",
      "details": "returned string is a comma separated string of invoice numbers.  The comma is also the end of the string if no other values appear.",
      "params":
      {
        "_clientName": "name of the client"
      },
      "returns":
      {
        "_0": "a comma seperated list of invoice numbers associated with the client."
      }
    },
    "isNoClient(string,address)":
    {
      "author": "Denis M. Putnam",
      "details": "no other details.",
      "params":
      {
        "_clientID": "clients wallet address.",
        "_clientName": "name of the client."
      }
    },
    "isNoDuplicateInvoice(string,uint256)":
    {
      "author": "Denis M. Putnam",
      "details": "no other details.",
      "params":
      {
        "_clientName": "name of the client.",
        "_invoiceNumber": "invoice number."
      }
    },
    "updateInvoice(string,uint256,uint256)":
    {
      "author": "Denis M. Putnam",
      "details": "no other details",
      "params":
      {
        "_clientName": "name of the client",
        "_invoiceNumber": "invoice number being requested.",
        "_invoicePmtDate": "payment date"
      }
    }
  },
  "title": "Invoice Tracking contract"
}
User Documentation
{
  "methods":
  {
    "addClient(address,string)":
    {
      "notice": "Add a client to this contract."
    },
    "addInvoice(string,uint256,uint256,uint256,string,uint256,uint256,uint256,uint256,uint256,uint256)":
    {
      "notice": "Add an invoice to track"
    },
    "changeOwner(address)":
    {
      "notice": "Change the current owner to the new owner."
    },
    "constructor": "The constructor for this contract",
    "getClientByIndex(uint256)":
    {
      "notice": "get the client by index number."
    },
    "getClientByName(string)":
    {
      "notice": "Get the requested client"
    },
    "getCurrentOwner()":
    {
      "notice": "Get the current owner."
    },
    "getInvoice(string,uint256)":
    {
      "notice": "Get an invoice"
    },
    "getInvoiceCount(string)":
    {
      "notice": "Get the count of invoices associated with the given client name"
    },
    "getInvoiceNumbers(string)":
    {
      "notice": "Get the list of invoice numbers as a string for the given client name."
    },
    "isNoClient(string,address)":
    {
      "notice": "Check for no client."
    },
    "isNoDuplicateInvoice(string,uint256)":
    {
      "notice": "Check for no duplicate invoice."
    },
    "updateInvoice(string,uint256,uint256)":
    {
      "notice": "Update an invoice with the payment date"
    }
  },
  "notice": "This contract tracks invoices for payment"
}

======= contracts/Owned.sol:Owned =======
Developer Documentation
{
  "author": "Denis M. Putnam",
  "details": "Use at your own risk.",
  "methods":
  {
    "changeOwner(address)":
    {
      "author": "Denis M. Putnam",
      "details": "No other details.",
      "params":
      {
        "newOwner": "new address payable owner."
      }
    },
    "constructor":
    {
      "author": "Denis M. Putnam",
      "details": "Sets the initial owner of the the contract."
    },
    "getCurrentOwner()":
    {
      "author": "Denis M. Putnam",
      "details": "No other details.",
      "returns":
      {
        "_0": "address current owner."
      }
    }
  },
  "title": "Owned contract"
}
User Documentation
{
  "methods":
  {
    "changeOwner(address)":
    {
      "notice": "Change the current owner to the new owner."
    },
    "constructor": "Constructor called when the contract is deployed.",
    "getCurrentOwner()":
    {
      "notice": "Get the current owner."
    }
  },
  "notice": "This contract establishes the owner and allows for an owner change."
}
## Solidity coverage
1. Make sure you run "npm install --save-dev solidity-coverage"
2. Run "truffle run coverage"

## Debugging
1. To debug the javascript test code and the the angular application add the following to the launch.json file:
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Run Tests",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "/Users/denisputnam/.nvm/versions/node/v12.16.1/lib/node_modules/truffle/build/cli.bundled.js",
      "args": [
        "test"
      ],
      "cwd": "${workspaceRoot}",
      "outFiles": [
        "${workspaceRoot}/test/**/*"
      ],
    }
  ]
}
2. To debug the javascript test code, do the Run Tests configuration.
3. To test the angular application, run the Launch Chrome configuration.
4. To debug the solidity contract, add the "debug()" wrapped around one of the await calls in the javascript tests
    and then in truffle run "test --debug".  This will cause truffle to stop at the debug() call and then you can 
    use the command line to step or display debug information. 
    For example: const result = await debug(invoiceTracker.getInvoiceNumbers("test"));
    will cause truffle to stop at the statement.

## Notes
  Below is the command line history of what I did for etherjs to connect to ropsten via metamask.
  505  npm install web3 

  https://app.diagrams.net/?libs=general;uml#G1xdswWXjxtiKqe4_1-VtyloQFIJgOwUne

# Useful commands
  truffle migrate --reset --network development
  truffle migrate --reset --network ropsten

# For IPFS
1. Run 'ng build --prod --aot'

2. ipfs init  // only once
3. in a separate window run ipfs daemon
4. ipfs swarm peers // only once
5. ipfs add -r dist/<your dapp>
6. ipfs add --recursive "full path to dist" // /Users/denisputnam/git/APDF-invoice-tracker-dapp/dist
7. ipfs name publish QmTRzgdod7Y5hN1HFYXtRH1BHbD3rNKaraaBMbkE1cReyT // hash is the dist one.  This just an example
8. Published to QmTRzgdod7Y5hN1HFYXtRH1BHbD3rNKaraaBMbkE1cReyT : /ipfs/QmTRzgdod7Y5hN1HFYXtRH1BHbD3rNKaraaBMbkE1cReyT
9. https://gateway.ipfs.io/ipfs/Qmc5TLVyDawBKrxP6jYyy7Z4Ekn3K6mjrTCCPEzTtXovQv

## index.html
Make sure that the <script> tag is in your index.html file.
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>APDFInvoiceTrackerDapp</title>
  <script>
    document.write('<base href="' + window.location.pathname + '"/>');
  </script>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>

<body>
  <app-root></app-root>
</body>

</html>

## Example
/Users/denisputnam/git/APDF-invoice-tracker-dapp>ng build --prod --aot
Generating ES5 bundles for differential loading...
ES5 bundle generation complete.

chunk {0} runtime-es2015.1eba213af0b233498d9d.js (runtime) 1.45 kB [entry] [rendered]
chunk {0} runtime-es5.1eba213af0b233498d9d.js (runtime) 1.45 kB [entry] [rendered]
chunk {2} polyfills-es2015.2c569cdf6ffecbea6ca5.js (polyfills) 37 kB [initial] [rendered]
chunk {3} polyfills-es5.394aa1f38aed2f431916.js (polyfills-es5) 130 kB [initial] [rendered]
chunk {1} main-es2015.72716919e3d1d6372f85.js (main) 1.85 MB [initial] [rendered]
chunk {1} main-es5.72716919e3d1d6372f85.js (main) 1.95 MB [initial] [rendered]
chunk {4} styles.33924162034a120ae456.css (styles) 141 kB [initial] [rendered]
Date: 2020-06-18T20:26:46.656Z - Hash: a95cf683532eb7aae77e - Time: 56253ms

WARNING in budgets: Exceeded maximum budget for initial-es2015. Budget 2 MB was not met by 30.6 kB with a total of 2.03 MB.


WARNING in budgets: Exceeded maximum budget for initial-es5. Budget 2 MB was not met by 216 kB with a total of 2.21 MB.
(base) Deniss-IMAC.fios-router.home:denisputnam
/Users/denisputnam/git/APDF-invoice-tracker-dapp>ipfs add -r dist/APDF-invoice-tracker-dapp/
added QmaFCeTRkmJcppfNBS1tF4iEbYGDT2LZTXcokPA24JcHPx APDF-invoice-tracker-dapp/3rdpartylicenses.txt
added QmQDLVoPGDjKBYdtccruufTVXm8b4s2SEbzjNwT6w73EBv APDF-invoice-tracker-dapp/favicon.ico
added QmQ5GBF1xpqSXVheaaL92CFppjuG33wKnaMDJB68KnM4SC APDF-invoice-tracker-dapp/index.html
added QmaKKXVBdb4pRjK7jGNPze5JxJ8H47Ppzg4LnvfEqih64X APDF-invoice-tracker-dapp/main-es2015.72716919e3d1d6372f85.js
added QmVcne2yMs1UoDdou3exybVt4o23bdixMHgyhJ4CbzMxBd APDF-invoice-tracker-dapp/main-es5.72716919e3d1d6372f85.js
added QmbXJrob58PnsadzXYprSzXLbnogRhBJK131TCTiB5TKy8 APDF-invoice-tracker-dapp/polyfills-es2015.2c569cdf6ffecbea6ca5.js
added QmQVjnkrruA1Z64kU4ysQ9us6A18JRiYjRQJZ2AVmwH2NQ APDF-invoice-tracker-dapp/polyfills-es5.394aa1f38aed2f431916.js
added Qmb3UHBRdMTRGA4AXa6XMbBxzkZFAihsEnd6qDvFtJ1qvN APDF-invoice-tracker-dapp/runtime-es2015.1eba213af0b233498d9d.js
added Qmb3UHBRdMTRGA4AXa6XMbBxzkZFAihsEnd6qDvFtJ1qvN APDF-invoice-tracker-dapp/runtime-es5.1eba213af0b233498d9d.js
added QmSCx4YXkUUqxHVoZDQN3RaPfFVFfge8m5DBHVzVLKKPh2 APDF-invoice-tracker-dapp/styles.33924162034a120ae456.css

added Qmc5TLVyDawBKrxP6jYyy7Z4Ekn3K6mjrTCCPEzTtXovQv APDF-invoice-tracker-dapp
 4.31 MiB / 4.31 MiB [========================================================================================================================] 100.00%(base) Deniss-IMAC.fios-router.home:denisputnam
/Users/denisputnam/git/APDF-invoice-tracker-dapp>ipfs name publish Qmc5TLVyDawBKrxP6jYyy7Z4Ekn3K6mjrTCCPEzTtXovQv
Published to QmRHwsSYncB7m2nYYFM2c2YGr2jefvDDdmjEgEzTb8RgXF: /ipfs/Qmc5TLVyDawBKrxP6jYyy7Z4Ekn3K6mjrTCCPEzTtXovQv

