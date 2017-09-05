class ListingResponse {
  constructor() {
    this.id = "";
    this.distance = null; // only applicable for search
    this.location = {
      latitude: 0, longitude: 0
    };
    this.title = "";
    this.asset = {
      assetId:"",
      title: "",
    }
    this.contributionTotal = 0;
    this.isActive = false;
    this.dateListed = "";
    this.listedByUserId = "";
  }
}

module.exports.ListingResponse = ListingResponse;
module.exports.convertFromDbDocument = function(document) {
  if(!document) return null;

  var result = new ListingResponse();
  Object.assign(result, document);
  if(!result.id && document._id) {
    result.id = document._id;
  }
  delete result._id;
  delete result.__v;
  delete result.updatedAt;
  delete result.createdAt;
  delete result.assetId;
  if(result.distance === null) {
    delete result.distance;
  }
  if(document.location) {
    delete result.location;
    if(Array.isArray(document.location)) {
      result.location = {
        latitude: document.location[0],
        longitude:document.location[1],
      }
    } else {
      result.location = {
        latitude:  document.location.latitude,
        longitude: document.location.longitude
      }
    }
  }
  return result;
}