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

const splytTrackerAbi = [{"constant":false,"inputs":[{"name":"_assetId","type":"string"},{"name":"_term","type":"uint256"},{"name":"_termType","type":"string"},{"name":"_title","type":"string"},{"name":"_totalCost","type":"uint256"},{"name":"_exiprationDate","type":"uint256"},{"name":"_mpAddress","type":"address"},{"name":"_mpAmount","type":"uint256"}],"name":"createAsset","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_listingId","type":"string"}],"name":"getAddressById","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownedBy","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contractAddr","type":"address"}],"name":"getIdByAddress","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_version","type":"uint256"},{"name":"_ownedBy","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_code","type":"uint256"},{"indexed":false,"name":"_message","type":"string"}],"name":"Error","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_code","type":"uint256"},{"indexed":false,"name":"_assetAddress","type":"address"}],"name":"Success","type":"event"}];
const assetAbi = [{"constant":true,"inputs":[],"name":"mpAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_title","type":"string"}],"name":"changeTitle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amountFund","type":"uint256"}],"name":"setFunded","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalCost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"assetId","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"title","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"mpAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"termType","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_userId","type":"string"}],"name":"getMyContributions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"expirationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAssetConfig","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"term","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contributePrecheck","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isFractional","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isContract","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"amountFunded","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_assetId","type":"string"},{"name":"_term","type":"uint256"},{"name":"_termType","type":"string"},{"name":"_title","type":"string"},{"name":"_totalCost","type":"uint256"},{"name":"_expirationDate","type":"uint256"},{"name":"_mpAddress","type":"address"},{"name":"_mpAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const satTokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"trackerAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"initUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"setTrackerAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalMinted","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_assetId","type":"string"},{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_mp2Address","type":"address"}],"name":"payout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_description","type":"string"},{"name":"_version","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"TransferEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"ApprovalEvent","type":"event"}];

const splytTrackerAddress = '0x2a30874dce9c9a0be0bcdf4b36a166a81e265383'
const satTokenAddress = '0x86e7497597694041dac1f108b83bf0feb4a0bc7b'

const badAddresses = ['0x0000000000000000000000000000000000000000', '0x0', '', '0x']


// Will create asset contract
exports.deployContracts = function deployContracts(asset, listing) {

  let splytTracker = new web3.eth.Contract(splytTrackerAbi, splytTrackerAddress);
  let d = new Date(listing.expirationDate)
  let expDateInSecs = Math.round(d.getTime() / 1000)
  console.log('Asset id:', asset.id)
  console.log('Asset term:', asset.term)
  console.log('Asset term type:', asset.termType)
  console.log('Asset title:', asset.title)
  console.log('Asset cost:', asset.totalCost)
  console.log('Asset expirationDate:', expDateInSecs)
  console.log('Asset market place wallet address:', listing.marketplace.walletAddress)
  console.log('Asset market place amount', listing.marketplace.kickbackAmount)

  // TODO: remove this temp term reset to 0
  let term = 0;

  splytTracker.methods.createAsset(
    asset.id.toString(),
    0,
    asset.termType.toString(),
    asset.title.toString(),
    asset.totalCost,
    expDateInSecs,
    listing.marketplace.walletAddress.toString(),
    listing.marketplace.kickbackAmount.toString()
  ).send({
    from: account,
    gas: 2000000,
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
    console.log('all done!')
  })
  .error(err => {
    console.log('Couldn\'t create asset contract')
    console.log(err)
  })
}

exports.createWallet = () => {
  return web3.eth.personal.newAccount('splytcore2017')
}

function getWalletBalance (address, cb) {
  var satToken = new web3.eth.Contract(satTokenAbi, satTokenAddress);

  satToken.methods.balanceOf(address).call({from:account}, function (err, balance) {
    cb(err, balance)
  })
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
  
  var satToken = new web3.eth.Contract(satTokenAbi, satTokenAddress);

  satToken.methods.initUser(address).send({
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

    if(badAddresses.indexOf(userWalletAddress) > -1) {
      return reject(new Error('User address not defined'))
    }
    if(asset.isFractional) {
      return reject('Fractional ownership coming soon')
    } else {

      var satToken = new web3.eth.Contract(satTokenAbi, satTokenAddress);

      console.log('Asset id:', asset.id)
      console.log('Buyer Wallet address:', userWalletAddress)
      console.log('Seller Wallet address:', listing.listedByWalletAddress)
      console.log('Amount contributing', amount)
      console.log('Contributing mp wallet addr:', contributingMarketplaceWalletAddress)
      satToken.methods.payout(asset.id.toString(), userWalletAddress.toString(), listing.listedByWalletAddress.toString(), amount, contributingMarketplaceWalletAddress)
      .send({
        from: account,
        gas: 2000000,
        gasPrice: 700000000000
      },
      (err, trxHash) => {
        if(err) {
          console.log(err)
          return reject(err)
        } else {
          console.log(trxHash)
          console.log('Contribution Successful!')
          var err = { insufficientFunds: false }
          resolve(err)
        }
      })
    }
  });
}

exports.getWalletBalance = getWalletBalance
exports.deactivate = deactivate;
exports.addresses = {
  splytTracker: splytTrackerAddress,
  satToken: satTokenAddress,
};