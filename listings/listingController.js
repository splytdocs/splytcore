var geolib = require("geolib");
var repo = require("./contextualListingRepoService").choose();
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var ListingResponse = require("./listingResponse")

var Asset = require("./../models/Asset");

function getUserFromContext(req) {
  return {
    id:mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'),
    name:"Fakerton McNotreal"
  }; // Just use a fake person until we get auth* worked out
};
function toListingResponse(fromDb, createdAsset) {
  const doc = fromDb._doc;
  const made = ListingResponse.convertFromDbDocument(doc);
  if(createdAsset) {
    // todo: refactor this hard
    const adoc = createdAsset._doc;
    made.asset = adoc;
    made.asset.id = adoc._id;
    delete made.asset.__v;
    delete made.asset._id;
    delete made.asset.createdAt;
    delete made.asset.updatedAt;
  }
  return made;
}

function send500(res, error) {
  // todo: Make this detect if the person can see 
  // full errors (dev/debug only)
  const sendFullError = true;
  const toSend = sendFullError ? error : { message: "We encountered an unexpected error, sorry." };
  res.status(500).json(toSend);
}
function send404ListingNotFound(res, id) {
  res.status(404).send(`Listing '${id}' not found.`);
}
function send200(res, output) {
  res.status(200).json(output);
}

function mapWithDistance(to, from) {
  const distance = geolib.getDistance(to.location, from);
  return Object.assign({}, to, {
    distance: distance
  });
}
//get /listings/search?location&sort&order&limit
exports.search = function(req, res, next) {
  let from = {
    latitude:33.690055033,
    longitude:-117.8346320117
  }; // todo: hardcoded for now, derive this from IP or have client pass in location or something
  if(req.params.latitude && req.params.longitude) {
    from = {
      latitude:  req.params.latitude,
      longitude: req.params.longitude
    }
  }
  const results = repo.search({
    location:from
  });
  results.then((envelope)=> {
    if(!envelope.error) {
      const searchResults = envelope.data;
      const output = searchResults
        .map((i)=>{
          const y = toListingResponse(i);
          const z = mapWithDistance(y, from);
          return z;
        })
        .sort((a, b)=>a.distance-b.distance);
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
      const output = toListingResponse(data.data);
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
  
  // todo: validation
  // todo: probably more complex when adding to a block chain
  const newListing = req.body;
  const listingUser = getUserFromContext(req);
  listingRequest = {
    listing:Object.assign({}, newListing),
    user:listingUser,
    asset: Object.assign({}, newListing.asset)
  };
  listingRequest.listing.location = [
    newListing.location.latitude,
    newListing.location.longitude
  ];
  listingRequest.listing.title = newListing.asset.title;

  delete listingRequest.listing.asset;
  //listingRequest.listing.assetId = new ObjectId();

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
        const output = toListingResponse(data.data, createdAsset);
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
      const output = toListingResponse(envelope.data);
      send200(res, output);
    } else {
      send404ListingNotFound(res, id);
    }
  });
  results.catch((data)=>{
    handleCommonListingError(res, id, data);
  });
};
// urgent:
// - create asset in db with listing
//   - add asset object to listing responses
// - real validation on POST listing
// - real search by distance
// - add real parameters to search
//    - location
//    - limit
//    - pagination
// - timeouts to prevent infinite waits on unhandled cases
// eventually:
// - refactor & tests
// - better orchestration and in-out adapters
//    - better injection of repo