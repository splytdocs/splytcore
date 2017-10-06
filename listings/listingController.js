const path = require('path');
const repo = require("./contextualListingRepoService").choose();
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const ethereum = require(path.resolve("./controllers/ethereum"));
const clr = require("./create/AjvCreateListingSchemaValidator");
const helpers = require("./../app/ResponseHelpers");
const send500 = helpers.send500,
      send200 = helpers.send200
      send404Message = helpers.send404Message,
      sendValidationError = helpers.sendValidationError;
const ListingSearchParameters = require("./ListingSearchParameters");
const ListingConversion = require("./ListingConversion");
const toListingResponse = ListingConversion.toListingResponse();
const mapWithDistance = ListingConversion.mapWithDistance();

var Asset = require("./../models/Asset");

function getUserFromContext(req) {
  /* Be sure you're authenticated, otherwise this won't be here */
  if(!req.user) throw 'req.user not found'
  return {
    id:req.user.id,
    name:req.user.name
  };
};

function send404ListingNotFound(res, id) {
  send404Message(res, `Listing '${id}' not found.`);
}

//get /listings/search?location&sort&order&limit
exports.search = function(req, res, next) {
  req.assert('latitude', 'latitude cannot be blank').notEmpty();
  req.assert('longitude', 'longitude cannot be blank').notEmpty();

  let results;
  let criteria;
  let from = {latitude:0, longitude:0}
  if(req.method == "GET") {
    criteria = ListingSearchParameters.build(req.query);
    from = {
      latitude: criteria.latitude,
      longitude:criteria.longitude
    };
    results = repo.search(criteria);
  } else {
    var criteria2 = Object.assign({}, req.body);
    const meta = Object.assign({}, criteria2.meta);
    delete criteria2.meta;
    from = {
      latitude: req.query.latitude,
      longitude:req.query.longitude
    };
    results = repo.searchByQuery(criteria2.match, meta);
  }

  function transformOneRecord(i) {
    const y = toListingResponse(i, null, req);
    const z = mapWithDistance(y, from);
    return z;
  }

  results.then((envelope)=> {
    if(!envelope.error) {
      const searchResults = envelope.data;
      const pagination = envelope.pagination;
      const items = searchResults
        .map(transformOneRecord)
        .sort((a, b)=>a.distance-b.distance);
      const output = {items, pagination};
      send200(res, output);
    } else {
      send500(res, envelope.error)
    }
  });
  results.catch((envelope)=>send500(res, envelope.error));
};
function handleCommonListingError(res, id, envelope) {
    const error = envelope.error;
    if(error.name == "CastError") {
      send404ListingNotFound(res, id);
    } else {
      send500(res, error);
    }
}
exports.getById = function(req, res, next) {
  req.assert('id', 'id cannot be blank').notEmpty();
  const id = req.params.id;
  const results = repo.findById(id);
  results.then((data)=> {
    if(!data.error && data.data) {
      const output = toListingResponse(data.data, null, req);
      send200(res, output);
    } else {
      send404ListingNotFound(res, id);
    }
  });
  results.catch((data)=>{
    handleCommonListingError(res, id, data);
  });
};

function persistAsset(listingRequest) {
  return new Promise((resolve, reject)=>{
    const document = Object.assign({}, listingRequest.asset);
    document.ownership = {};
    Asset.create(document, (error, object)=>{
      if(error) {
        reject({error: error});
      }
      else {
        resolve({data:object})
      }
    });
  });
}
exports.create = function(req, res, next) {
  const validator = new clr.AjvCreateListingSchemaValidator();
  const newListing = req.body;
  const validationSummary = validator.validate(newListing);

  if(validationSummary.length) {
    sendValidationError(res, validationSummary);
    return;
  }

  const listingUser = getUserFromContext(req);
  listingRequest = {
    listing:Object.assign({}, newListing),
    user:Object.assign({}, listingUser),
    asset: Object.assign({}, newListing.asset)
  };
  listingRequest.listing.title = newListing.asset.title;

  delete listingRequest.listing.asset;

  function inlineAsset() {
    const results = persistAsset(listingRequest);
    results.then((data)=> {
      if(!data.error && data.data) {
        listingRequest.assetId = data.data._id;
        inlineListing(data.data);
      } else {
        send500(res, data.error);
      }
    });
    results.catch((data)=>send500(res, data.error));
  }

  function inlineListing(createdAsset) {
    const results = repo.addNew(listingRequest);
    results.then((data)=> {
      if(!data.error && data.data) {
        const output = toListingResponse(data.data, createdAsset, req);
        // ethereum.deployContracts(createdAsset, data.data);
        res.status(201).json(output);
      } else {
        send500(res, data.error);
      }
    });
    results.catch((data)=>send500(res, data.error));
  }

  inlineAsset();
};


exports.delete = function(req, res, next) {
  req.assert('id', 'id cannot be blank').notEmpty();
  // todo: validation
  // todo: require application/json
  // todo: Ensure that user deleting this actually owns the listing
  const id = req.params.id;
  const results = repo.deactivate(id);
  results.then((envelope)=> {
    if(!envelope.error && envelope.data) {
      const output = toListingResponse(envelope.data, null, req);
      send200(res, output);
    } else {
      send404ListingNotFound(res, id);
    }
  });
  results.catch((data)=>{
    handleCommonListingError(res, id, data);
  });
};

exports.mine = function(req, res, next) {
  const userId = req.user.id;
  const criteria = {
    "listedByUserId": new mongoose.Types.ObjectId(userId)
  };
  const results = repo.searchByQuery(criteria);
  results.then((envelope)=> {
    if(!envelope.error) {
      const searchResults = envelope.data;
      const output = {
        items:searchResults
          .map((i)=>toListingResponse(i, null, req))
        };
      send200(res, output);
    } else {
      send500(res, envelope.error)
    }
  });
  results.catch((envelope)=>send500(res, envelope.error));
};