const BackupListingResponse = require("./listingResponse");
const BackupGeolib = require("geolib");

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
      .forEach(i => removeMongoFields(i._doc));
  }
  if(asset.ownership && asset.ownership.stakes) {
    removeMongoFields(asset.ownership._doc);
    asset.ownership.stakes
      .forEach(i => removeMongoFields(i._doc));
  }
  return asset;
}

function inferUri(req, listing) {
  const baseUri = req.protocol + '://' + req.get('host');
  return `${baseUri}/api/listings/${listing.id}`;
};
module.exports.inferUri = inferUri;
module.exports.mapWithDistance = (geolib = BackupGeolib) => (to, from) => {
  const actualTo = to.location._doc || to.location;
  const distance = geolib.getDistance(actualTo, from);
  return Object.assign({}, to, {distance: distance});
};
module.exports.mutateToAssetResponse = mutateToAssetResponse;
module.exports.toListingResponse = (ListingResponse = BackupListingResponse) => (fromDb, createdAsset, req) => {
  if (!fromDb) 
    return null;
  const doc = fromDb._doc;
  const made = ListingResponse.convertFromDbDocument(doc);
  function fixUpAsset(asset) {
    mutateToAssetResponse(asset);
  }
  if (fromDb.asset) {
    made.asset = fromDb.asset._doc;
  }
  if (createdAsset) {
    made.asset = createdAsset._doc;
  }
  if (made.asset) {
    fixUpAsset(made.asset);
  }
  if (made.location) {
    removeMongoFields(made.location._doc);
  }
  function amendHref(target) {
    target.href = inferUri(req, target);
  }
  amendHref(made);
  return made;
}