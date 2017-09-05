var Listing = require("../models/Listing");
var Asset = require("../models/Asset");
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.search = function(query) {
  return new Promise((resolve, reject)=>{
    Listing.find({
      isActive:true,
    })
    //.limit(1)
    .exec((error, found)=> {
      const waitingFor = [];
      if(error) { 
        reject({error: error}); 
      }
      else {
        const mapped = found.map((listing)=> {
          const assetId1 = listing.assetId;
          const assetId2 = listing._doc.assetId;
          const withAsset = findAndAmendAsset(listing);
           /* ignore responses for now */
          withAsset.then((d)=>{});
          withAsset.catch((e)=>{
            console.log(".search:error amending asset to listing", arguments, listing);
          });
          waitingFor.push(withAsset);
          return listing;
        });
        const all = Promise.all(waitingFor);
        all.then(()=>{
          resolve({data:mapped});
        });
        all.catch(()=>{
          resolve({data:mapped});
        });
      }
    });
  });
};
exports.findById = function(id) {
  return new Promise((resolve, reject)=>{
    Listing.findById(id)
    .exec(function(error, found){
      if(error) { 
        reject({error: error}); 
      }
      else {
        const withAsset = findAndAmendAsset(found);
        withAsset.then(()=>{
          resolve({data:found});
        });
        withAsset.catch((e)=>{
          reject({error:e});
        });
      }
    });
  });
};
function findAndAmendAsset(listing) {
  return new Promise((resolve, reject)=>{
    if(!listing) {
      // Couldn't find the listing, don't bother looking for an asset
      resolve(listing);
      return;
    }
    Asset.findById(listing.assetId).exec((error, asset)=>{
      if(error) reject(error);
      else {
        listing.asset = asset;
        resolve(listing);
      }
    });
  });
};
exports.deactivate = function(id) {
  return new Promise((resolve, reject)=>{
    const options = {new:true};
    Listing.findByIdAndUpdate(id, 
      { $set: { isActive:false }}, 
      options, 
      (error, found, zed)=>{
        if(error) { 
          reject({error: error}); 
        }
        else {
          const withAsset = findAndAmendAsset(found);
          withAsset.then(()=>{
            resolve({data:found});
          });
          withAsset.catch((e)=>{
            reject({error:e});
          });
        }
    });
  });
};
function convertListingRequestToDocument(listingRequest) {
  const doc = Object.assign({},listingRequest.listing);
  doc.listedByUserId = listingRequest.user.id;
  doc.assetId = listingRequest.assetId;
  return doc;
}
exports.addNew = function(listingRequest) {
  return new Promise((resolve, reject)=>{
    const document = convertListingRequestToDocument(listingRequest);
    Listing.create(document, (error, object)=>{
      if(error) { 
        reject({error: error}); 
      }
      else {
        resolve({data:object})
      }
    });
  });
};