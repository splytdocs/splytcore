var ListingSource = require("./MockDataRepository");
var geolib = require("geolib");
var repo = ListingSource;

function mapWithDistance(to, from) {
    const distance = geolib.getDistance(to, from);
    return Object.assign({}, {
      distance: distance
    }, to);
  }
//get /listings/search?location&sort&order&limit
exports.search = function(req, res, next) {
  const from = {
    latitude:33.690055033,
    longitude:-117.8346320117
  }; // todo: hardcoded for now, derive this from IP or have client pass in location or something
  
  const results = repo.search({
    location:req.params.location,
  });
  results.then((data)=> {
    const output = data
      .map((i)=>mapWithDistance(i, from))
      .sort((a, b)=>a.distance-b.distance);
    res.status(200).json(output);
  });
  results.catch((error)=>res.status(500));
};

exports.getById = function(req, res, next) {
  req.assert('id', 'id cannot be blank').notEmpty();
  const id = req.params.id;
  const results = repo.findById(id);
  results.then((data)=> {
    if(data) {
      res.status(200).json(data);
    } else {
      res.status(404).send(`Listing '${id}' not found.`)
    }
  });
  results.catch((error)=>res.status(500).json(error));
};
exports.postNew = function(req, res, next) {
  // todo: validation
  // todo: probably more complex when adding to a block chain
  const newListing = req.body;
  const results = repo.addNew(newListing);
  results.then((data)=> {
    res.status(201).json(data);
  });
  results.catch((error)=>res.status(500).json(error));
};
exports.delete = function(req, res, next) {
  req.assert('id', 'id cannot be blank').notEmpty();
  // todo: validation
  // todo: require application/json
  // todo: Ensure that user deleting this actually owns the listing
  const id = req.params.id;
  const results = repo.deactivate(id);
  results.then((data)=> {
    if(data) {
      res.status(200).json(data);
    } else {
      res.status(404).send(`Listing '${id}' not found.`)
    }
  });
  results.catch((error)=>res.status(500).json(error));
};