var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
const all = require("./mock_data.js").all;
var newid = require("bson-objectid");

function convertToApiListing(fromFile) {
  
  return fromFile;
}

exports.search = function (query) {
  return new Promise((resolve, reject) => {
    resolve(all.map(convertToApiListing));
  });
};
exports.findById = function (id) {
  return new Promise((resolve, reject) => {
    const found = convertToApiListing(all.find(i => i.id == id));
    resolve(found);
  });
};
exports.deactivate = function (id) {
  return new Promise((resolve, reject) => {
    const found = convertToApiListing(all.find(i => i.id == id))
    if (found) {
      found.isActive = false;
    }
    // todo: only works in memory for now
    resolve(found);
  });
};
exports.addNew = function (data) {
  return new Promise((resolve, reject) => {
    console.log("adding new", data);
    const formatted = Object.assign({}, {
      id: newid(),
      dateListed: new Date(),
      listedByUserId: "59965e66fc13ae40cf00005b"
    }, data);
    formatted.asset.id = newid();
    formatted.asset.contributedTotal = 0;
    console.log("formatted:", formatted);
    all.push(formatted);
    resolve(formatted);
  });
}