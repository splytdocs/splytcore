# Getting started
1. [Setting up your Geth Server](#setting-up-your-geth-server)
1. [Backend Server Architecture](#backend-server-architecture)
1. [Connecting to Ethereum](#connecting-to-ethereum)
1. [Ethereum.js Library](#ethereumjs-library)
1. [Create a Listing](#create-a-listing)
1. [How to own/fractionally own a listing](#how-to-ownfractionally-own-a-listing)
1. [Responding to Ethereum events to update your database](#responding-to-ethereum-events-to-update-your-database)
1. [Client side market place](#client-side-market-place)
1. [Things needed from a user of a market place](#things-needed-from-a-user-of-a-market-place)

## Setting up your Geth Server

### Downloading geth client:

- Download ethereum client (geth) from [here](https://geth.ethereum.org/downloads/).
-  Extract it to a desired location.
-  Open terminal and cd to the folder where geth is located.

### Creating a wallet:

-  Then type ```./geth --testnet account new``` in the terminal to create a new testnet wallet.
-  Geth client will prompt you to enter password `twice` to create a wallet.

### Downloading public testnet:

-  Type in terminal ```./geth --testnet --verbosity 1 console .``` This will sync the Ropsten testnet to your computer.
-  Current block # for Ropsten is # 3,077,160 at the time of writing. So sit back and wait until your node downloads all the blocks up till the current block.
-  You can check the sync status buy typing in geth console ```web3.eth.syncing``` which will display block information.
-  Get your wallet address by typing ```web3.eth.accounts[0]``` We'll get some fake ether from here. You'll need to give them your  wallet address.
-  Get solidity compiler using ```sudo npm install -g solc``` (Installing npm is outside of this tutorial's scope).
-  CD to the compiler installation directory. Usually its in ```~/.npm-packages/lib/node_modules/solc```
-   Lets compile our contract by typing:  ```./solcjs --abi --bin -o Full-path-to-output-folder Full-path-to-input-contract-file```
- This will generate a folder in the Full-path-to-output-folder that contains binary conversion and ABI of the contract. Binary file is what we insert to blockchain. ABI (Application Binary Interface) is what we use to access the contract on blockchain.
- Rename the files ```Contractname.bin``` and ```Contractname.abi``` respectively.
- By now you should have fake ether sent to your wallet. Check it by sending this command in geth terminal. ```web3.eth.getBalance(web3.eth.accounts[0]```) . If it says zero. Then you haven't recieved ether. try step 10 again.
---

## Backend Server Architecture 
Today we use a traditional client-server architecture for our Splyt demo. It consists of a Geth server, and a RESTful API written in Node.JS using Express, and MongoDB to . The marketplace websites use a PHP backend to communicate with the API, and normal front-end technologies on the client side. 

Be sure not to expose your Geth server to the internet. Consider keeping it within your own network and allow only connections from authorized hosts, like your API server.

### Configuration
- **Platform:** node
- **Framework**: express
- **Database**: mongodb

### Connecting to Ethereum
In `ethereum.js` you'll find the functions to interact with Ethereum using Splyt's smart contracts. It expects an environment variable of `ETHEREUM_URI`, which is the URI to Geth server. It should be something like `http://127.0.0.1:8585` depending on your network and Geth configuration. 

### Ethereum.js Library
We use the Web3 package to communicate with our Geth server. <https://github.com/ethereum/web3.js/>
Our `ethereum.js` module wraps those interactions, so you shouldn't need to use web3 directly for Splyt transactions. Just be sure to set the `ETHEREUM_URI` environment variable mentioned earlier.

### Create a Listing
Ethereum transactions do not resolve immediately, which requires a different mindset in making your application. When a user creates a listing, it may take a great deal of time for that transaction to be entirely processed, and could fail for any number of reasons. Obviously, you won't want to wait that long to give a response to your user. The recommended approach is to create a unique identifier, and store a correlation record in your own database with that identifier. You'll listen for the resolution of that listing event, and then updating your record accordingly with the Ethereum result.

The `ethereum.deployContracts` function submits your listing to Ethereum. It expects two parameters, information about the asset in the listing, and information about the listing itself, including the marketplace. Currently, nothing is returned as it is expected that your application will listen for the eventual completion of this event, explained later in this document.

**Anticipate breaking changes as we iterate on, and improve the API. It is likely to be changed and simplified.**

```js
const ethereum = require("./controllers/ethereum.js");
const uuidv4 = require("uuid/v4"); // https://www.npmjs.com/package/uuid

// The date this listing should expire, such as in thirty days
const expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + 30);

const asset = {
  // Your unique correlation ID for this asset
  id: uuidv4().toString(),
  // The string ID of the terms for ownership of this asset.
  // Right now we only support DAYS, but will be expanding this to other
  // terms as the product grows.
  termType: "DAYS",
  // The title or short description of the asset
  title: "Contemporary Art",
  // The integer amount of SATs for all costs for this asset
  totalCost: 32168
};
const marketplace = {
  // The wallet address of the marketplace creating this listing
  walletAddress: process.env.MARKETPLACE_WALLET_ADDRESS,
  // The integer percent of the final amount that will be given to the marketplace which completes the sale of this listing
  kickbackAmount: 5
};
ethereum.deployContracts(asset, {
  expirationDate,
  marketplace
});
```

### How to own/fractionally own a listing
For non-fractional listings one must contribute the full amount of SATs for the asset. For fractional assets, partial amounts are acceptable. 

**Anticipate breaking changes as we iterate on, and improve the API. It is likely to be changed and simplified.**

```js
const ethereum = require("./controllers/ethereum.js");

const contribution = {
  // The amount of SATs the user is attempting to contribute
  amount: 4000,
  // The address of the contributor's wallet
  userWalletAddress: "0x...",
  asset: {
    // Whether this asset is fractionally owned (coming soon!)
    isFractional: false,
    // Your correlation ID for this asset, generated when the listing was created
    id: "f9acaf3d-276a..."
  },
  // The address of the user selling this asset
  listing: { listedByWalletAddress: "0x..." }
};
ethereum.contribute(contribution);
```

A Promise is returned from this function. If there is an immediately-detectable error, it will contain that information. Otherwise, it is resolved successfully, and your application will listen for the eventual completion of this event, explained later in this document.

### Responding to Ethereum events to update your database
Coming soon!

### Client side market place
Coming soon!

### Things needed from a user of a market place
Coming Soon!

---------------------------------------------------

### License
The MIT License (MIT)

Copyright (c) 2018 Splyt Core

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
