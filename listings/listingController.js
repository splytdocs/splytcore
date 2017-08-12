var ListingSource = require("./MockDataRepository");
var geolib = require("geolib");
var repo = ListingSource;

//get /listings/search?location&sort&order&limit
exports.search = function(req, res, next) {
  const from = {
    latitude:33.690055033,
    longitude:-117.8346320117
  }; // todo: hardcoded for now, derive this from IP or have client pass in location or something
  function mapWithDistance(to) {
    const distance = geolib.getDistance(to, from);
    return Object.assign({}, {
      distance: distance
    }, to);
  }
  var results = repo.search({
    location:req.params.location,
  });
  results.then((data)=> {
    const output = data
      .map(mapWithDistance)
      .sort((a, b)=>a.distance-b.distance);
    res.status(200).json(output);
  });
  results.catch((data)=>res.status(500).json(data))
  ;
};
