const searchCriteriaBuilder = require('./ListingSearchParameters').build;
const helpers = require("./../app/ResponseHelpers");
const send500 = helpers.send500,
      send200 = helpers.send200
      send404Message = helpers.send404Message,
      sendValidationError = helpers.sendValidationError;
const ListingConversion = require("./ListingConversion");
const mutateToAssetResponse = ListingConversion.mutateToAssetResponse;
const Scrub = require("./../app/Scrub");
const standardMongoScrub = Scrub.standardMongoScrub;
const Asset = require("./../models/Asset");
const Listing = require("./../models/Listing");
const statuses = require("./OwnershipStatuses").makeStatuses();
const SingleErrorResponse = require("./../app/SingleErrorResponse");
const User = require("./../models/User");

function makeCriteria(userId) {
  return searchCriteriaBuilder({
    listedByUserId: userId,
    limit: 0
  });
}
function prepAsset(record, req) {
  const output = standardMongoScrub(record);
  ListingConversion.mutateToAssetResponse(output);
  return output;
}
function findOwnedAssets(userId) {
  return new Promise((resolve, reject)=>{ 
    const criteria = {
      "ownership.stakes.userId":userId
    };
    Asset.find(criteria, (err, results)=>{
      if(err) reject(err);
      else resolve(results);
    });
  });
}
module.exports.getOwnershipController = listingRepo => (req, res, next)=>{
  const userId = req.user.id;
  const promise = findOwnedAssets(userId);
  promise.catch(err=>{
    send500(res, err)
  });
  promise.then((searchResults)=>{
    if(!searchResults) {
      return send500(res);
    }
    const prepOne = (i)=>prepAsset(i, req);
    const output = {
      items: searchResults.map(prepOne)
    };
    send200(res, output);
  });
};
function prepAssetAndSend200(res, record) {
  const output = prepAsset(record);
  send200(res, output)
}
function persistAssetAndRespond(res, assetRecord) {
  assetRecord.save((err)=>{
    if(err) {return send500(res, err);}
    prepAssetAndSend200(res, assetRecord);
  });
}
function createStake(res, Asset, {assetRecord, userId, amount}) {
  assetRecord.ownership.stakes.push({
    userId, amount
  });
  persistAssetAndRespond(res, assetRecord);
}
function updateStake(res, Asset, {assetRecord, usersStake, userId, amount}){
  usersStake.amount = amount;
  persistAssetAndRespond(res, assetRecord);
}
function reaggregateSellerNumberOfFundedAssets(listing) {
  User.findById(listing.listedByUserId, (error, user)=> {
    if(!user) return;
    user.numberOfFundedAssets = user.numberOfFundedAssets + 1;
    user.save();
  });
}
function handleAfterFundingReached(deactivator, asset) {
  const deactivateListing = (listing) => {
    deactivator({listing,asset})
    reaggregateSellerNumberOfFundedAssets(listing);
  };
  const logFailure = (error) => {
    console.warn("Unable to find associated listing to deactivate", error, asset._id);
  };
  // Do this async, don't really care to respond with its results
  Listing.findOne({assetId:asset._id})
    .then(deactivateListing, logFailure);
}
module.exports.putOwnershipController = ({listingRepo, Asset = require("./../models/Asset"), deactivator}) => (req, res, next)=>{
  // This is very much a utility method right now
  // It will need to behave much differently with real data
  // todo: better, standard validation
  const userId = req.user.id;
  const assetId = req.query.assetId;
  const amount = parseFloat(req.query.amount);
  const isOpenForFunding = (assetRecord) => {
    return assetRecord.ownership.status == statuses.open;
  };

  Asset.findById(assetId, (err, assetRecord)=>{
    if(err) {return send500(res, err);}
    if(!assetRecord) { return send404Message(res, "Asset not found") };
    if(assetRecord.ownership == null) {
      assetRecord.ownership = {
        stakes:[]
      }
    }
    if(!isOpenForFunding(assetRecord)) {
      const err = SingleErrorResponse.InvalidRequestError({
        code: SingleErrorResponse.codes.notOpenForFunding,
        message: "This asset is not open for funding."
      })
      return sendValidationError(res, [err]);
    }
    let usersStake = assetRecord.ownership.stakes
      .find(i=>i.userId==userId);
    
    assetRecord.on('funded', 
      (asset)=>handleAfterFundingReached(deactivator, asset.asset));

    if(usersStake == null) {
      createStake(res, Asset, {assetRecord, userId, amount});
    } else {
      updateStake(res, Asset, {assetRecord, usersStake, userId, amount});
    }
  });
  // todo: This will obviously require wallet & blockchain interaction at some point
};
/*
#	Vehicle	Listing name	Amount Funded	Ownership %	City		Status	Action
29	2018 BMW Z4	BMW	$10,000	5%	Los Angeles	OWNED	Redeem	Sell
30	2018 BMW Z4	BMW	$23,000	25%	Los Angeles	OPEN	25% Funded	View
*/