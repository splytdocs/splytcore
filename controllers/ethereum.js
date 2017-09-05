var Web3 = require('web3')
var path = require('path')
var fs = require('fs')

// This is currently erroring causing the app not to run
// Remove these lines to reenable it
console.error("Ethereum disabled temporarily, look at ethereum.js to re-enable.")
return;


if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

// connection check 
web3.eth.getAccounts( function(err, res) {
  if(!err && res) {
    console.log('Connected to ethereum client')
  }
})

// check for unlocked wallet address
console.log(web3.personal)
web3.eth.getAccounts((err, res) => {
  console.log(res)
})
// web3.personal.getListWallets(function(err, res) {
//   for(wallet in res) {
//     console.log('wallet address' + wallet.accounts[0].address + ' has status of ' + wallet.status)
//   }
// })

var splytTrackerAddr = '0xfa7b5786751758aec7a3fd3cf7a5b34e3ae2401d'
var splytTrackerAbi

var transactionConfig = {
  from: web3.eth.defaultAccount,
  gas: 4300000
}

fs.readFile(path.resolve('./contracts/SplytTracker/SplytTracker.abi'), 'utf8', function (err,data) {
  if (err) {
    console.log(err)
  }
  splytTrackerAbi = data
})

var splytTracker = splytTrackerAbi.at(splytTrackerAddr)


function createListing(listingObj) {
  var l = listingObj
  splytTracker.createListing(
    l._id, 
    l.createdAt, 
    l.isActive, 
    l.lng, 
    l.lat, 
    l.user._id, 
    l.user.name,
    transactionConfig,
    (err, res) => {
      if(err) {
        return false
      } else {
        return true        
      }
    })
}