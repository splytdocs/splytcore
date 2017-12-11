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

const splytTrackerAbi = [{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_listingId","type":"string"},{"name":"_listingAddressS","type":"address"}],"name":"addToTracker","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_listingId","type":"string"}],"name":"getAddressById","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownedBy","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contractAddr","type":"address"}],"name":"getIdByAddress","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_version","type":"uint256"},{"name":"_ownedBy","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const listingAbi = [{"constant":false,"inputs":[{"name":"_title","type":"string"}],"name":"changeTitle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getListingConfig","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"bool"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_expirationDate","type":"string"}],"name":"changeExpirationDate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_isActive","type":"bool"}],"name":"changeActiveInactive","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_listingId","type":"string"},{"name":"_title","type":"string"},{"name":"_listedByUserId","type":"string"},{"name":"_dateListed","type":"string"},{"name":"_expirationDate","type":"string"},{"name":"_assetAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const assetAbi = [{"constant":false,"inputs":[{"name":"_title","type":"string"}],"name":"changeTitle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_userId","type":"string"}],"name":"contribute","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_userId","type":"string"}],"name":"getMyContributions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAssetConfig","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_assetId","type":"string"},{"name":"_term","type":"uint256"},{"name":"_termType","type":"string"},{"name":"_title","type":"string"},{"name":"_totalCost","type":"uint256"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}];
const splytTokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"initUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalMinted","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_description","type":"string"},{"name":"_version","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"TransferEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"ApprovalEvent","type":"event"}];

const splytTrackerAddress = '0x1b7264fefA6a7A0858ec34B0D2E0c394c2d03122'
const splytTokenAddress = '0xe2dcfca20ee270b1adbd4e69bee18236a75505e5'

const assetData = '0x6060604052341561000f57600080fd5b6040516109773803806109778339810160405280805182019190602001805191906020018051820191906020018051820191906020018051919060200180519150600090508680516100659291602001906100cf565b506001859055600284805161007e9291602001906100cf565b506005805460ff19166001179055600483805161009f9291602001906100cf565b5060069190915560078054600160a060020a031916600160a060020a039092169190911790555061016a92505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061011057805160ff191683800117855561013d565b8280016001018555821561013d579182015b8281111561013d578251825591602001919060010190610122565b5061014992915061014d565b5090565b61016791905b808211156101495760008155600101610153565b90565b6107fe806101796000396000f3006060604052600436106100615763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632dbe07c781146100955780635c43217b146100e65780638672aeff1461012c578063994dfab51461018f575b600160a060020a0333163480156108fc0290604051600060405180830381858888f19350505050151561009357600080fd5b005b34156100a057600080fd5b61009360046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284375094965061032595505050505050565b61009360046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284375094965061035495505050505050565b341561013757600080fd5b61017d60046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284375094965061044e95505050505050565b60405190815260200160405180910390f35b341561019a57600080fd5b6101a26104bd565b604051808060200189815260200180602001888152602001806020018715151515815260200186815260200185600160a060020a0316600160a060020a0316815260200184810384528c818151815260200191508051906020019080838360005b8381101561021b578082015183820152602001610203565b50505050905090810190601f1680156102485780820380516001836020036101000a031916815260200191505b5084810383528a818151815260200191508051906020019080838360005b8381101561027e578082015183820152602001610266565b50505050905090810190601f1680156102ab5780820380516001836020036101000a031916815260200191505b50848103825288818151815260200191508051906020019080838360005b838110156102e15780820151838201526020016102c9565b50505050905090810190601f16801561030e5780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b60075433600160a060020a039081169116141561035157600481805161034f929160200190610728565b505b50565b60055460009060ff16151561039a57600160a060020a0333163480156108fc0290604051600060405180830381858888f19350505050151561039557600080fd5b600080fd5b6103a2610700565b905080156103dc57600160a060020a0333163480156108fc0290604051600060405180830381858888f1935050505015156103dc57600080fd5b346008836040518082805190602001908083835b6020831061040f5780518252601f1990920191602091820191016103f0565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051908190039020805490910190555050565b60006008826040518082805190602001908083835b602083106104825780518252601f199092019160209182019101610463565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020549050919050565b6104c56107a6565b60006104cf6107a6565b60006104d96107a6565b60008060008060015460026003546004600560009054906101000a900460ff16600654600760009054906101000a9004600160a060020a0316878054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105a75780601f1061057c576101008083540402835291602001916105a7565b820191906000526020600020905b81548152906001019060200180831161058a57829003601f168201915b50505050509750858054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106435780601f1061061857610100808354040283529160200191610643565b820191906000526020600020905b81548152906001019060200180831161062657829003601f168201915b50505050509550838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106df5780601f106106b4576101008083540402835291602001916106df565b820191906000526020600020905b8154815290600101906020018083116106c257829003601f168201915b50505050509350975097509750975097509750975097509091929394959697565b60006006543460035401111515610721575060038054340190556000610725565b5060015b90565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061076957805160ff1916838001178555610796565b82800160010185558215610796579182015b8281111561079657825182559160200191906001019061077b565b506107a29291506107b8565b5090565b60206040519081016040526000815290565b61072591905b808211156107a257600081556001016107be5600a165627a7a723058203ac5d952c0b042ad45b036e90a83fe955eba1e60fe490345489c85f7f47778cc0029';
const listingData = '0x6060604052341561000f57600080fd5b604051610a23380380610a238339810160405280805182019190602001805182019190602001805182019190602001805182019190602001805182019190602001805160068054600160a060020a03191633600160a060020a031617905591506000905086805161008492916020019061010d565b50600185805161009892916020019061010d565b5060028480516100ac92916020019061010d565b5060038380516100c092916020019061010d565b506004805460ff1916600117905560058280516100e192916020019061010d565b5060078054600160a060020a031916600160a060020a0392909216919091179055506101a89350505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061014e57805160ff191683800117855561017b565b8280016001018555821561017b579182015b8281111561017b578251825591602001919060010190610160565b5061018792915061018b565b5090565b6101a591905b808211156101875760008155600101610191565b90565b61086c806101b76000396000f3006060604052600436106100615763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632dbe07c781146100665780633cbc75a4146100b95780634e24258d1461030e578063f72e16b91461035f575b600080fd5b341561007157600080fd5b6100b760046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284375094965061037795505050505050565b005b34156100c457600080fd5b6100cc6103a6565b6040518415156080820152600160a060020a0380841660c0830152821660e0820152610100808252819060208201906040830190606084019060a085019085018e818151815260200191508051906020019080838360005b8381101561013c578082015183820152602001610124565b50505050905090810190601f1680156101695780820380516001836020036101000a031916815260200191505b5086810385528d818151815260200191508051906020019080838360005b8381101561019f578082015183820152602001610187565b50505050905090810190601f1680156101cc5780820380516001836020036101000a031916815260200191505b5086810384528c818151815260200191508051906020019080838360005b838110156102025780820151838201526020016101ea565b50505050905090810190601f16801561022f5780820380516001836020036101000a031916815260200191505b5086810383528b818151815260200191508051906020019080838360005b8381101561026557808201518382015260200161024d565b50505050905090810190601f1680156102925780820380516001836020036101000a031916815260200191505b50868103825289818151815260200191508051906020019080838360005b838110156102c85780820151838201526020016102b0565b50505050905090810190601f1680156102f55780820380516001836020036101000a031916815260200191505b509d505050505050505050505050505060405180910390f35b341561031957600080fd5b6100b760046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284375094965061073f95505050505050565b341561036a57600080fd5b6100b76004351515610769565b60065433600160a060020a03908116911614156103a35760018180516103a1929160200190610793565b505b50565b6103ae610811565b6103b6610811565b6103be610811565b6103c6610811565b60006103d0610811565b600654600090819033600160a060020a03908116911614156107355760045460065460075460008054909360019360029360039360ff90931692600592600160a060020a039081169216908890600019818a16156101000201168790046020601f820181900481020160405190810160405280929190818152602001828054600181600116156101000203166002900480156104ad5780601f10610482576101008083540402835291602001916104ad565b820191906000526020600020905b81548152906001019060200180831161049057829003601f168201915b50505050509750868054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105495780601f1061051e57610100808354040283529160200191610549565b820191906000526020600020905b81548152906001019060200180831161052c57829003601f168201915b50505050509650858054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105e55780601f106105ba576101008083540402835291602001916105e5565b820191906000526020600020905b8154815290600101906020018083116105c857829003601f168201915b50505050509550848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106815780601f1061065657610100808354040283529160200191610681565b820191906000526020600020905b81548152906001019060200180831161066457829003601f168201915b50505050509450828054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561071d5780601f106106f25761010080835404028352916020019161071d565b820191906000526020600020905b81548152906001019060200180831161070057829003601f168201915b50505050509250975097509750975097509750975097505b9091929394959697565b60065433600160a060020a03908116911614156103a35760058180516103a1929160200190610793565b60065433600160a060020a03908116911614156103a3576004805482151560ff1990911617905550565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106107d457805160ff1916838001178555610801565b82800160010185558215610801579182015b828111156108015782518255916020019190600101906107e6565b5061080d929150610823565b5090565b60206040519081016040526000815290565b61083d91905b8082111561080d5760008155600101610829565b905600a165627a7a72305820c42055208925d1463e198b0c1c82fa2565f2a9b5655383d166b5dd32a9ed283d0029';

// Will create asset contract
exports.deployContracts = function deployContracts(asset, listing) {

  var assetContract = new web3.eth.Contract(assetAbi);

  assetContract.deploy({
    data: assetData,
    arguments: [asset.id, asset.term, asset.termType, asset.title, asset.costBreakdown[0].amount, listing.listedByWalletAddress]
  }).send({
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
    const contractAddress = newContractInstance.options.address;
    listing.assetAddress = contractAddress;
    createListing(listing);
  })
  .error(err => {
    console.log('deploy asset contract on error triggered')
    console.log(err)
  })
}

// Will create listing contract
function createListing(listing) {
  var listingContract = new web3.eth.Contract(listingAbi);
  //listing.marketplace may be null for old listings
  //also applies to editing
  //listing.marketplace.walletAddress
  //listing.marketplace.kickbackAmount
  listingContract.deploy({
    data: listingData,
    arguments: [listing._id, listing.title, listing.listedByUserId, listing.dateListed, listing.expirationDate, listing.assetAddress]
  })
  .send({
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
    const contractAddress = newContractInstance.options.address;
    listing.address = contractAddress;
    addToTracker(listing);
  })
  .error(err => {
    console.log('create listing error triggered')
    console.log(err)
  })
}

// Will update tracker with addresses
function addToTracker(listing) {
  var splytTracker = new web3.eth.Contract(splytTrackerAbi, splytTrackerAddress);
  console.log('Now inserting to tracker')
  console.log('listing id: 0x', listing._id)
  console.log('listing address: ', listing.address)
  splytTracker.methods.addToTracker('0x' + listing._id, listing.address).send({
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
    console.log('all done!')
  })
  .error(err => {
    console.log('add to tracker error triggered')
    console.log(err)
  })
}

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
      reject('Fractional ownership coming soon')
    } else {
      // confirm user has enough tokens to buy an asset

      // using listing._id talk to splytTracker.sol and get listing.address
      // using listing.address talk to listing.sol and get asset.address
      // using asset.address talk to asset and get totalcost

      // confirm totalCost === amount

      // tell sat token contract to transfer totalCost amount to seller
      // resolve()
    }
    if(!web3.utils.isAddress(userWalletAddress)) {
      return reject(new Error('User address not defined'))
    }
    getWalletBalance(userWalletAddress, (err, balance) => {
      if(err) {
        console.log('1')
        return reject(err)
      } else if(balance < amount) {
        console.log('2')
        return reject(new Error('Insufficient funds'))
      }
      console.log('3')
      getAssetTotalCost(listing._id, asset._id)
      .then((totalCost, owner) => {
        console.log(totalCost)
        console.log(owner)
        console.log('10')
        var splytToken = new web3.eth.Contract(splytTokenAbi, splytTokenAddress);
        // if(totalCost == amount) {
          console.log('11')
          splytToken.methods.transferFrom(userWalletAddress, listing.listedByWalletAddress, amount).send({
            from: account,
            gas: 4300000,
            gasPrice: 700000000000
          },
          (err, trxHash) => {
            if(err) {
              console.log(err)
              return reject(err)
            } else {
              console.log(trxHash)
              resolve(false)
            }
          })
        // }

      })
    })

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
    splytTracker.methods.getAddressById('0x' + listingId.toString()).call({from:account}, function (err, listingAddress) {
      console.log(listingAddress)
      console.log('5')
      if(err) {
        console.log('6')
        return reject(err)
      } else if(!web3.utils.isAddress(listingAddress)) {
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
exports.createListing = createListing;
exports.addToTracker = addToTracker;
exports.deactivate = deactivate;