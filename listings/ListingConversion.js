const BackupListingResponse = require("./listingResponse");
const BackupGeolib = require("geolib");
const _docOrSelf = require("./../app/Scrub")._docOrSelf;

function removeMongoFields(toAlter) {
  if (!toAlter) 
    return toAlter;
  delete toAlter.__v;
  delete toAlter._id;
  delete toAlter.createdAt;
  delete toAlter.updatedAt;
  return toAlter;
}
function mutateToAssetResponse(asset) {
  // todo: refactor this a lot
  asset.id = asset._id;
  removeMongoFields(asset);
  if (asset.costBreakdown) {
    asset.costBreakdown
      .forEach(i => removeMongoFields(_docOrSelf(i)));
  }
  if(asset.ownership && asset.ownership.stakes) {
    removeMongoFields(_docOrSelf(asset.ownership));
    asset.ownership.stakes
      .forEach(i => removeMongoFields(_docOrSelf(i)));
  }
  if(asset.photos) {
    asset.photos
      .forEach(i => removeMongoFields(_docOrSelf(i)));
  }
  return asset;
}

function inferUri(req, listing, baseUri=process.env.api_base_uri) {
  return `${baseUri}api/listings/${listing.id}`;
};
module.exports.inferUri = inferUri;
module.exports.mapWithDistance = (geolib = BackupGeolib) => (to, from) => {
  const actualTo = to.location._doc || to.location;
  let distance = undefined;
  if(from.latitude!==undefined || from.longitude!==undefined) {
    distance = geolib.getDistance(actualTo, from);
  }
  return Object.assign({}, to, {distance});
};
module.exports.mutateToAssetResponse = mutateToAssetResponse;
module.exports.toListingResponse = (ListingResponse = BackupListingResponse) => (fromDb, createdAsset, req) => {
  if (!fromDb) 
    return null;
  const doc = _docOrSelf(fromDb);
  const made = ListingResponse.convertFromDbDocument(doc);
  function fixUpAsset(asset) {
    mutateToAssetResponse(asset);
  }
  if (fromDb.asset && fromDb.asset._doc) {
    made.asset = fromDb.asset._doc;
  }
  if (createdAsset) {
    made.asset = _docOrSelf(createdAsset);
  }
  if (made.asset) {
    fixUpAsset(made.asset);
  }
  if (made.location) {
    removeMongoFields(_docOrSelf(made.location));
  }
  function amendHref(target) {
    target.href = inferUri(req, target);
  }
  amendHref(made);
  return made;
}