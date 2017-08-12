const shortid = require("shortid");
const all = require("./mock_data.js").all;

exports.search = function(query) {
  return new Promise((resolve, reject)=>{
    resolve(all);
  });
};
exports.findById = function(id) {
  return new Promise((resolve, reject)=>{
    const found = all.find(i=>i.id==id);
    resolve(found);
  });
};
exports.deactivate = function(id) {
  return new Promise((resolve, reject)=>{
    const found = all.find(i=>i.id==id);
    if(found) {
      found.isActive = false;
    }
    // todo: only works in memory for now
    resolve(found);
  });
};
exports.addNew = function(data) {
  return new Promise((resolve, reject)=>{
    console.log("adding new", data);
    const formatted = Object.assign({}, {
      id: shortid.generate(),
      dateListed: JSON.stringify(new Date())
    }, data);
    all.push(formatted);
    // todo: only works in memory for now
    resolve(formatted);
  });
}