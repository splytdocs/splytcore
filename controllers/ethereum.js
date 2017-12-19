const Web3 = require('web3')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

let account;


if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_URI));
}

// connection check
web3.eth.getAccounts( function(err, res) {
  if(err) {
    console.error(chalk.red('Could not connect to ethereum on ', process.env.ETHEREUM_URI))
    console.log(err)
  } else {
    console.log(chalk.green('Connected to ethereum on ', process.env.ETHEREUM_URI))
    account = res[0]
  }
})

const splytTrackerAbi = [{"constant":false,"inputs":[{"name":"_assetId","type":"string"},{"name":"_term","type":"uint256"},{"name":"_termType","type":"string"},{"name":"_title","type":"string"},{"name":"_totalCost","type":"uint256"},{"name":"_exiprationDate","type":"uint256"}],"name":"createAsset","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_listingId","type":"string"}],"name":"getAddressById","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownedBy","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contractAddr","type":"address"}],"name":"getIdByAddress","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_version","type":"uint256"},{"name":"_ownedBy","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_code","type":"uint256"},{"indexed":false,"name":"_message","type":"string"}],"name":"Error","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_code","type":"uint256"},{"indexed":false,"name":"_assetAddress","type":"address"}],"name":"Success","type":"event"}];
const assetAbi = [{"constant":false,"inputs":[{"name":"_title","type":"string"}],"name":"changeTitle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amountFund","type":"uint256"}],"name":"setFunded","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalCost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"assetId","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"title","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"termType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userId","type":"string"}],"name":"getMyContributions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"expirationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAssetConfig","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"term","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contributePrecheck","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isFractional","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isContract","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"amountFunded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_assetId","type":"string"},{"name":"_term","type":"uint256"},{"name":"_termType","type":"string"},{"name":"_title","type":"string"},{"name":"_totalCost","type":"uint256"},{"name":"_expirationDate","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const satTokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"trackerAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"initUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"setTrackerAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_assetId","type":"string"},{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"payout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalMinted","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_description","type":"string"},{"name":"_version","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"TransferEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"ApprovalEvent","type":"event"}];

const splytTrackerAddress = '0x82801d8199c130800CD8005193273731Ad41c3eb'
const satTokenAddress = '0xe57ca50a424f59454d499f1fdf27b6f828adc44d'

const assetData = '0x6060604052341561000f57600080fd5b604051610dcc380380610dcc8339810160405280805182019190602001805190602001909190805182019190602001805182019190602001805190602001909190805190602001909190505085600090805190602001906100719291906100db565b5084600181905550836002908051906020019061008f9291906100db565b5082600490805190602001906100a69291906100db565b5081600581905550806006819055506001600760006101000a81548160ff021916908315150217905550505050505050610180565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061011c57805160ff191683800117855561014a565b8280016001018555821561014a579182015b8281111561014957825182559160200191906001019061012e565b5b509050610157919061015b565b5090565b61017d91905b80821115610179576000816000905550600101610161565b5090565b90565b610c3d8061018f6000396000f3006060604052600436106100d0576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632dbe07c7146100d55780632ea49a63146101325780633c5e6c971461015557806344de240a1461017e5780634a79d50c1461020c57806374f84ddf1461029a5780638672aeff146103285780638f62048714610399578063994dfab5146103c2578063a10ffbed1461054f578063b6000e5f14610578578063c520e717146105a5578063f7ec2f35146105d2578063f9c36fde146105ff575b600080fd5b34156100e057600080fd5b610130600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610628565b005b341561013d57600080fd5b6101536004808035906020019091905050610642565b005b341561016057600080fd5b61016861064c565b6040518082815260200191505060405180910390f35b341561018957600080fd5b610191610652565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101d15780820151818401526020810190506101b6565b50505050905090810190601f1680156101fe5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561021757600080fd5b61021f6106f0565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561025f578082015181840152602081019050610244565b50505050905090810190601f16801561028c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102a557600080fd5b6102ad61078e565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102ed5780820151818401526020810190506102d2565b50505050905090810190601f16801561031a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561033357600080fd5b610383600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061082c565b6040518082815260200191505060405180910390f35b34156103a457600080fd5b6103ac6108a1565b6040518082815260200191505060405180910390f35b34156103cd57600080fd5b6103d56108a7565b604051808060200189815260200180602001888152602001806020018715151515815260200186815260200185815260200184810384528c818151815260200191508051906020019080838360005b8381101561043f578082015181840152602081019050610424565b50505050905090810190601f16801561046c5780820380516001836020036101000a031916815260200191505b5084810383528a818151815260200191508051906020019080838360005b838110156104a557808201518184015260208101905061048a565b50505050905090810190601f1680156104d25780820380516001836020036101000a031916815260200191505b50848103825288818151815260200191508051906020019080838360005b8381101561050b5780820151818401526020810190506104f0565b50505050905090810190601f1680156105385780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b341561055a57600080fd5b610562610acf565b6040518082815260200191505060405180910390f35b341561058357600080fd5b61058b610ad5565b604051808215151515815260200191505060405180910390f35b34156105b057600080fd5b6105b8610af5565b604051808215151515815260200191505060405180910390f35b34156105dd57600080fd5b6105e5610b12565b604051808215151515815260200191505060405180910390f35b341561060a57600080fd5b610612610b25565b6040518082815260200191505060405180910390f35b806004908051906020019061063e929190610b58565b5050565b8060038190555050565b60055481565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106e85780601f106106bd576101008083540402835291602001916106e8565b820191906000526020600020905b8154815290600101906020018083116106cb57829003601f168201915b505050505081565b60048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107865780601f1061075b57610100808354040283529160200191610786565b820191906000526020600020905b81548152906001019060200180831161076957829003601f168201915b505050505081565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108245780601f106107f957610100808354040283529160200191610824565b820191906000526020600020905b81548152906001019060200180831161080757829003601f168201915b505050505081565b60006008826040518082805190602001908083835b6020831015156108665780518252602082019150602081019050602083039250610841565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020549050919050565b60065481565b6108af610bd8565b60006108b9610bd8565b60006108c3610bd8565b600080600080600154600260035460046108db610b2b565b600554600654878054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109765780601f1061094b57610100808354040283529160200191610976565b820191906000526020600020905b81548152906001019060200180831161095957829003601f168201915b50505050509750858054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a125780601f106109e757610100808354040283529160200191610a12565b820191906000526020600020905b8154815290600101906020018083116109f557829003601f168201915b50505050509550838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610aae5780601f10610a8357610100808354040283529160200191610aae565b820191906000526020600020905b815481529060010190602001808311610a9157829003601f168201915b50505050509350975097509750975097509750975097509091929394959697565b60015481565b6000610adf610b2b565b15610aed5760019050610af2565b600090505b90565b6000806001541115610b0a5760019050610b0f565b600090505b90565b600760009054906101000a900460ff1681565b60035481565b6000600354600554111580610b4257506006544211155b15610b505760019050610b55565b600090505b90565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610b9957805160ff1916838001178555610bc7565b82800160010185558215610bc7579182015b82811115610bc6578251825591602001919060010190610bab565b5b509050610bd49190610bec565b5090565b602060405190810160405280600081525090565b610c0e91905b80821115610c0a576000816000905550600101610bf2565b5090565b905600a165627a7a72305820ca6d14900b4c58fc08b732eebbe791f641427d8cf5d824449a5b3332fcd3b4470029';
const badAddresses = ['0x0000000000000000000000000000000000000000', '0x0', '', '0x']


// Will create asset contract
exports.deployContracts = function deployContracts(asset, listing) {

  var splytTracker = new web3.eth.Contract(splytTrackerAbi, splytTrackerAddress);
  var d = new Date(listing.expirationDate)
  var expDateInSecs = Math.round(d.getTime() / 1000)
  console.log('Asset id:', asset.id)
  console.log('Asset term:', asset.term)
  console.log('Asset term type:', asset.termType)
  console.log('Asset title:', asset.title)
  console.log('Asset cost:', asset.totalCost)
  console.log('Asset expirationDate:', expDateInSecs)
  splytTracker.methods.createAsset(asset.id.toString(), asset.term, asset.termType.toString(), asset.title.toString(), asset.totalCost, expDateInSecs).send({
    from: account,
    gas: 200000,
    gasPrice: 99000000000
  },
  (err, trxHash) => {
    if(err) {
      console.log(err)
    } else {
      console.log(trxHash)
    }
  })
  .then(newContractInstance => {
    console.log('all done!')
  })
  .error(err => {
    console.log('add to tracker error triggered')
    console.log(err)
  })
}

// // Will create listing contract
// function createListing(listing) {
//   var listingContract = new web3.eth.Contract(listingAbi);
//   //listing.marketplace may be null for old listings
//   //also applies to editing
//   //listing.marketplace.walletAddress
//   //listing.marketplace.kickbackAmount
//   listingContract.deploy({
//     data: listingData,
//     arguments: [listing._id, listing.title, listing.listedByUserId, listing.dateListed, listing.expirationDate, listing.assetAddress]
//   })
//   .send({
//       from: account,
//       gas: 4300000,
//       gasPrice: 700000000000
//   },
//   (err, trxHash) => {
//     if(err) {
//       console.log(err)
//     } else {
//       console.log(trxHash)
//     }
//   })
//   .then(newContractInstance => {
//     const contractAddress = newContractInstance.options.address;
//     listing.address = contractAddress;
//     addToTracker(listing);
//   })
//   .error(err => {
//     console.log('create listing error triggered')
//     console.log(err)
//   })
// }

// // Will update tracker with addresses
// function addToTracker(listing) {
//   var splytTracker = new web3.eth.Contract(splytTrackerAbi, splytTrackerAddress);
//   console.log('Now inserting to tracker')
//   console.log('listing id: 0x', listing._id)
//   console.log('listing address: ', listing.address)
//   splytTracker.methods.addToTracker('0x' + listing._id, listing.address).send({
//     from: account,
//     gas: 4300000,
//     gasPrice: 700000000000
//   },
//   (err, trxHash) => {
//     if(err) {
//       console.log(err)
//     } else {
//       console.log(trxHash)
//     }
//   })
//   .then(newContractInstance => {
//     console.log('all done!')
//   })
//   .error(err => {
//     console.log('add to tracker error triggered')
//     console.log(err)
//   })
// }

exports.createWallet = () => {
  // static password for now. will need to tie in user's password later. if we do consider tying reset password or forgot password.
  return web3.eth.personal.newAccount('splytcore2017')
}

function getWalletBalance (address, cb) {
  var splytToken = new web3.eth.Contract(splytTokenAbi, splytTokenAddress);

  splytToken.methods.balanceOf(address).call({from:account}, function (err, balance) {
    cb(err, balance)
  })
  // web3.eth.getBalance(address, (err, balance) => {
  //   if(err) {
  //     cb(err, null)
  //   } else {
  //     cb(null, web3.utils.fromWei(balance, 'szabo'))
  //   }
  // })
}


function deactivate({listing, asset}) {
  return new Promise((resolve, reject)=>{
    console.log("ethereum deactivate:", arguments);
    const results = {};
    // todo: do something
    resolve(results);
  });
}

exports.giveOutTokens = (address, cb) => {
  var splytToken = new web3.eth.Contract(splytTokenAbi, splytTokenAddress);

  splytToken.methods.initUser(address).send({
    from: account,
    gas: 4300000,
    gasPrice: 700000000000
  },
  (err, trxHash) => {
    if(err) {
      console.log(err)
    } else {
      console.log(trxHash)
    }
  })
  .then(newContractInstance => {
    console.log('Cool!. User has some tokens now!')
    cb(null, null)
  })
  .error(err => {
    console.log('Could not sent transaction to iniUser()')
    console.log(err)
    cb(null, null)
  })
}

exports.contribute = ({amount, userId, userWalletAddress, asset, listing, contributingMarketplaceWalletAddress}) => {
  /* Checking the wallet and withdrawing the money to wherever
  is presumably an atomic event. If there aren't enough funds
  use the error below so we can handle it specifically. If it's
  some other error, just bubble it up.
  It'd be great to get the wallet's new balance as well just so
  we keep the database consistent with the source of truth. */
  return new Promise((resolve, reject)=>{
    if(asset.isFractional) {
      return reject('Fractional ownership coming soon')
    } else {
      // confirm user has enough tokens to buy an asset

      // using listing._id talk to splytTracker.sol and get listing.address
      // using listing.address talk to listing.sol and get asset.address
      // using asset.address talk to asset and get totalcost

      // confirm totalCost === amount

      // tell sat token contract to transfer totalCost amount to seller
      // resolve()
    
      if(badAddresses.indexOf(userWalletAddress) > -1) {
        return reject(new Error('User address not defined'))
      }

      var satToken = new web3.eth.Contract(satTokenAbi, satTokenAddress);

      console.log('Asset id:', asset.id)
      console.log('Buyer Wallet address:', userWalletAddress)
      console.log('Seller Wallet address:', listing.listedByWalletAddress)
      console.log('Amount contributing', amount)
      splytTracker.methods.payout(
        asset.id.toString(),
        listing.listedByWalletAddress.toString(),
        userWalletAddress.toString(),
        amount
      ).send({
        from: account,
        gas: 200000,
        gasPrice: 99000000000
      },
      (err, trxHash) => {
        if(err) {
          console.log(err)
        } else {
          console.log(trxHash)
        }
      })
      .then(newContractInstance => {
        console.log('Contribution Successful!')
        resolve()
      })
      .error(err => {
        console.log('Error trying to contribute to an asset')
        console.log(err)
        return reject(err)
      })
    }


    // getWalletBalance(userWalletAddress, (err, balance) => {
    //   if(err) {
    //     console.log('1')
    //     return reject(err)
    //   } else if(balance < amount) {
    //     console.log('2')
    //     return reject(new Error('Insufficient funds'))
    //   }
    //   console.log('3')
    //   console.log('listing id', listing.id)
    //   console.log('asset id', asset.id)
    //   getAssetTotalCost(listing.id, asset.id)
    //   .then((totalCost, owner) => {
    //     console.log('total cost for this asset', totalCost)
    //     console.log('owner of this asset', owner)
    //     console.log('10')
    //     var splytToken = new web3.eth.Contract(splytTokenAbi, splytTokenAddress);
    //     // if(totalCost == amount) {
    //       console.log('11')
    //       console.log('transfer from params:', userWalletAddress, listing.listedByWalletAddress, amount)
    //       splytToken.methods.transferFrom(userWalletAddress, listing.listedByWalletAddress, amount).send({
    //         from: account,
    //         gas: 4300000,
    //         gasPrice: 700000000000
    //       },
    //       (err, trxHash) => {
    //         if(err) {
    //           console.log(err)
    //           return reject(err)
    //         } else {
    //           console.log(trxHash)
    //           resolve(false)
    //         }
    //       })
    //     // }

    //   })
    // })

    // let insufficientFunds = false;
    // let newWalletBalance = 0;
    // if(insufficientFunds) {
    //   let actualWalletBalance = 0;
    //   const error = new Error("Insufficient funds");
    //   error.insufficientFunds = true;
    //   error.walletBalance = actualWalletBalance;
    //   return reject(error);
    // }
    // let ethError = null;
    // // if some other error
    // if(ethError) {
    //   return reject(ethError);
    // }
    // // if successful
    // resolve({
    //   newWalletBalance
    //   /* Add whatever else you need here */
    // })
  });
}

function getAssetTotalCost(listingId, assetId) {

  return new Promise((resolve, reject)=>{
    console.log('4')
    var splytTracker = new web3.eth.Contract(splytTrackerAbi, splytTrackerAddress);
    var hexListingId = '0x' + listingId.toString()
    splytTracker.methods.getAddressById(hexListingId).call({from:account}, function (err, listingAddress) {
      console.log('listing address', listingAddress)
      console.log('5')
      if(err) {
        console.log('6')
        return reject(err)
      } else if(badAddresses.indexOf(listingAddress.toString()) > -1) {
        console.log('7')

        return reject(new Error('Listing not found on blockchain'))
      }

      let listingContract = new web3.eth.Contract(listingAbi, listingAddress);
      listingContract.methods.getListingConfig().call({from:account},
        function (err, res) {
          console.log('7')
          if(err) {
            console.log('8')
            return reject(err)
          } else if(res['7'].length < 5) {
            console.log('9')
            return reject(new Error('Asset not found on blockchain'))
          }

          let assetContract = new web3.eth.Contract(assetAbi, res['7'])
          assetContract.methods.getAssetConfig().call({from:account},
            function (err, res) {
              console.log('10')
              resolve(res['6'], res['7'])
            })
      })
    })
  })
}

exports.getWalletBalance = getWalletBalance
exports.deactivate = deactivate;