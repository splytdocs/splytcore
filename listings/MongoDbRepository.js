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
        resolve({data:found})
      }
    });
  });
};
exports.findById = function(id) {
  return new Promise((resolve, reject)=>{
    Listing.findById(id, function whatever(error, found){
      if(error) { 
        reject({error: error}); 
      }
      else {
        resolve({data:found})
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
          resolve({data:found})
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