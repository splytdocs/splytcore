var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
const all = require("./mock_data.js").all;
var newid = require("bson-objectid");

function convertToApiListing(fromFile) {
  if(!fromFile) return null;
  return { _doc:fromFile }
}
exports.search = function (query) {
  return new Promise((resolve, reject) => {
    resolve({data:all.map(convertToApiListing)});
  });
};
exports.findById = function (id) {
  return new Promise((resolve, reject) => {
    let found = convertToApiListing(all.find(i => i.id == id));
    resolve({data:found});
  });
};
exports.deactivate = function (id) {
  return new Promise((resolve, reject) => {
    let found = all.find(i => i.id == id);
    if (found) {
      found.isActive = false;
    }
    const output = convertToApiListing(found);
    resolve({data:output});
  });
};
function convertListingRequestToDocument(listingRequest) {
  const doc = Object.assign({},listingRequest.listing);
  doc.listedByUserId = listingRequest.user.id;
  return doc;
}
exports.addNew = function (listingRequest) {
  return new Promise((resolve, reject) => {
    console.log("adding new", listingRequest);
    const document = convertListingRequestToDocument(listingRequest);
    const formatted = Object.assign({}, {
      id: newid(),
      dateListed: new Date(),
      //listedByUserId: "59965e66fc13ae40cf00005b"
      isActive: true
    }, document);
    formatted.asset = {};
    formatted.asset.id = newid();
    formatted.asset.contributedTotal = 0;
    console.log("formatted:", formatted);
    all.push(formatted);
    resolve({data:convertToApiListing(formatted)});
  });
}