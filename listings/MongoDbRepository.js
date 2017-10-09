var Listing = require("../models/Listing");
var Asset = require("../models/Asset");
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
const mutatePaginationResponseOnto = require("./../app/Pagination").mutatePaginationResponseOnto;

function searchByQuery(criteria, meta) {
  return new Promise((resolve, reject) => {
    if(!meta) meta = {};
    let query = Listing.aggregate([
      { "$lookup": {
        "localField": "assetId",
        "from": "assets",
        "foreignField": "_id",
        "as": "asset"
      } },
      { "$unwind": "$asset" }
    ]);
    query.match(criteria);

    if(meta.sort) {
      query.sort(meta.sort);
    }
    
    function withResults(error, data, numberOfPages, totalCount) {
      if (error) {
        reject({error});
      } else {
        const output = {data};
        mutatePaginationResponseOnto(output, {numberOfPages, totalCount});
        resolve(output);
      }
    }
    function inferPage() {
      const offset = meta.offset || 0;
      const limit = meta.limit || 1;
      return Math.ceil(offset/limit);
    }
    const paginationOptions = {
      limit: meta.limit,
      page: inferPage()
    };
    Listing.aggregatePaginate(query, paginationOptions, withResults);
  });
};
exports.search = function (criteria) {
  let x = criteria.includeDeactivated? {} : {isActive: true};
  let y = Object.assign({}, x, criteria);
  delete y.limit;
  delete y.offset;
  delete y.includeDeactivated;
  delete y.latitude;
  delete y.longitude;

  return searchByQuery(y, {
    limit:y.limit,
    offset:y.offset
  });
};
exports.searchByQuery = searchByQuery;
exports.findById = function (id) {
  return new Promise((resolve, reject) => {
    Listing
      .findById(id)
      .exec(function (error, found) {
        if (error) {
          reject({error: error});
        } else {
          const withAsset = findAndAmendAsset(found);
          withAsset.then(() => {
            resolve({data: found});
          });
          withAsset.catch((e) => {
            reject({error: e});
          });
        }
      });
  });
};
function findAndAmendAsset(listing) {
  return new Promise((resolve, reject) => {
    if (!listing) {
      // Couldn't find the listing, don't bother looking for an asset
      resolve(listing);
      return;
    }
    Asset
      .findById(listing.assetId)
      .exec((error, asset) => {
        if (error) 
          reject(error);
        else {
          listing.asset = asset;
          resolve(listing);
        }
      });
  });
};
exports.deactivate = function (id) {
  return new Promise((resolve, reject) => {
    const options = {
      new: true
    };
    Listing.findByIdAndUpdate(id, {
      $set: {
        isActive: false
      }
    }, options, (error, found, zed) => {
      if (error) {
        reject({error: error});
      } else {
        const withAsset = findAndAmendAsset(found);
        withAsset.then(() => {
          resolve({data: found});
        });
        withAsset.catch((e) => {
          reject({error: e});
        });
      }
    });
  });
};
function convertListingRequestToDocument(listingRequest) {
  const doc = Object.assign({}, listingRequest.listing);
  doc.listedByUserId = listingRequest.user.id;
  doc.assetId = listingRequest.assetId;
  return doc;
}
exports.addNew = function (listingRequest) {
  return new Promise((resolve, reject) => {
    const document = convertListingRequestToDocument(listingRequest);
    Listing.create(document, (error, object) => {
      if (error) {
        reject({error: error});
      } else {
        resolve({data: object})
      }
    });
  });
};