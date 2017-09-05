var Listing = require("../models/Listing");
var Asset = require("../models/Asset");
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.search = function(query) {
  return new Promise((resolve, reject)=>{
    Listing.find({
      isActive:true,
    }).exec((error, found)=> {
      if(error) { 
        reject({error: error}); 
      }
      else {
        const mapped = found.map((listing)=> {
          const withAsset = findAndAmendAsset(listing);
           /* ignore responses for now */
          withAsset.then((d)=>{});
          withAsset.catch((e)=>{});
          return listing;
        });
        resolve({data:mapped});
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
    Asset.findById(listing.assetId).exec((error, asset)=>{
      if(error) reject(error);
      else {
        listing.asset = asset;
        resolve(listing);
      }
    });
  });
}
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
/*

  id: { type: Schema.Types.ObjectId, default: new ObjectId(), required: true },
  title: { type: String, required: true },
  listedByUserId: {type: Schema.Types.ObjectId, required: true },
  dateListed: { type: Date, default: Date.now, required: true },
  isActive: { type: Boolean, default: true, required: true },
  contributionTotal: { type: Number, min: 0, required: true },

  assetId: {type: Schema.Types.ObjectId, required: true },
  location: {
    type: [Number],
    index: '2d',
    required: true
  },
  */
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