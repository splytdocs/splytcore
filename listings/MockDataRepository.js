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
}