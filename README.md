
## Preface

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
## Getting started
1. [Server + Client side market place](#server--client-side-market-place)
2. [Client side market place](#client-side-market-place)
3. [Ethereum.js Library](#ethereumjs-library)
4. [Things needed from a market place builder](#things-needed-from-a-market-place-builder)
5. [Things needed from a user of a market place](#things-needed-from-a-user-of-a-market-place)
6. [How to create a listing](#how-to-create-a-listing)
7. [How to own/fractionally own a listing](#how-to-ownfractionally-own-a-listing)


### Server + Client side market place

> Write about the traditional client + server architecture we have currently in our demo. For ex., Where to put geth server, how to connect to geth securely, saving just empty listing object in DB which will give unique objectId which you can use to send a transaction to blockchain, then saving more meta in DB upon receiving the events. And when does ethereum.js file come to play in this structure.

### Client side market place

> Using ethereum.js file on client-side. how to either use a hosted geth server as a market place owner or have user sync their own node. Explaining security benefits of using client-side only structure. 

### Ethereum.js Library
> How to connect to a geth client, how to keep connection alive or keep checking to see if connection is active or not. What to do when an event gets triggered. (Save in mongodb - server side or save it in leveldb - client side). Explain overall reasoning behind ethereum.js library and overall structure of it.

### Things needed from a market place builder
> Unique identifier for listings IDs, market place wallet address, marketplace kickback amount
### Things needed from a user of a market place
> Ability to send transactions from user's wallet, either metamask, or personal wallet, some ether amount and bunch of SAT tokens
### How to create a listing
> Explain the steps needed to create a listing AKA explain `deployContracts` function in ethereum.js file
### How to own/fractionally own a listing
> Explain the steps needed to own a listing, AKA explain `contribute` function in ethereum.js file
---------------------------------------------------


## Server architecture 

### Configuration
- **Platform:** node
- **Framework**: express
- **Template Engine**: jade
- **CSS Framework**: none
- **CSS Preprocessor**: css
- **JavaScript Framework**: 
- **Build Tool**: none
- **Unit Testing**: none
- **Database**: mongodb
- **Authentication**: facebook,email,google,twitter
- **Deployment**: Staging

### License
The MIT License (MIT)

Copyright (c) 2018 Splyt Core

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
