var Listing = require("../models/Listing");
var Asset = require("../models/Asset");
var mongoose = require('mongoose');

exports.search = function(query) {
  return new Promise((resolve, reject)=>{
    resolve(all);
  });
};
exports.findById = function(id) {
  return new Promise((resolve, reject)=>{
    const found = all.find(i=>i.id==id);
    resolve(found);
  });
};
exports.deactivate = function(id) {
  return new Promise((resolve, reject)=>{
    const found = all.find(i=>i.id==id);
    if(found) {
      found.isActive = false;
    }
    // todo: only works in memory for now
    resolve(found);
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
  return {
    title: listingRequest.listing.title,
    listedByUserId: listingRequest.user.id,
    location: listingRequest.listing.location,
    assetId: new mongoose.Schema.Types.ObjectId()
  };
}
exports.addNew = function(listingRequest) {
  return new Promise((resolve, reject)=>{
    const document = convertListingRequestToDocument(listingRequest);
    const listingToSave = new Listing(document);
    listingToSave.save(function onSaveCallback(error) {
      if(error) { 
        reject({error: error}); 
      }
      else {
        resolve({listing:listingToSave})
      }
    });
  });
}