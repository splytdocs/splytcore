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
/*

var listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  listedByUserId: {type: ObjectId, required: true },
  dateListed: { type: Date, default: Date.now, required: true },
  isActive: { type: Boolean, default: true, required: true },
  contributionTotal: { type: Number, min: 0, required: true, default:0 },
   "Foreign key" to Asset 
  //assetId: { type:ObjectId, required: false },
  location: {
    type: [Number],
    index: '2d',
    required: true
  },
}, schemaOptions);
*/