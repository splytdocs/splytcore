const s3 = require("./S3Photos");
const helpers = require("./../app/ResponseHelpers");
const send500 = helpers.send500,
      send200 = helpers.send200,
      send201 = helpers.send201,
      send404Message = helpers.send404Message,
      sendValidationError = helpers.sendValidationError;

module.exports.controller = associator => function(req, res, next) {
  const files = req.files;
  if(!files) {
    return sendValidationError(res, [{
      code:"required",
      message:"No files found"
    }]);
  }
  const items = files.map(i=>{
    return {uri: i.location}
  });
  associator({req, files, items}, (error, data) => {
    if(error) return send500(error);
    send201(res, {items});
  });
};
module.exports.associateWithAsset = Asset => ({req, files, items}, callback) => {
  const assetId = req.params.id;
  Asset.findById(assetId, (error, data) => {
    if(error) return callback(error, null);
    items.forEach(i=>data.photos.push(i))
    data.save((e2)=>{
      if(e2) return callback(e2, null);
      callback(null, data);
    });
  });
};