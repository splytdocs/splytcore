const all = require("./mock_data.js").all;
exports.search = function(query) {
  return new Promise((resolve, reject)=>{
    resolve(all);
  });
};