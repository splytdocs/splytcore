var path = require('path');
const helpers = require("./../app/ResponseHelpers");
const send500 = helpers.send500,
      send200 = helpers.send200,
      send201 = helpers.send201,
      send404Message = helpers.send404Message,
      sendValidationError = helpers.sendValidationError;

module.exports.controller = associator => function(req, res, next) {
  const files = req.files;
  const userId = req.user.id;
  if(!files) {
    return sendValidationError(res, [{
      code:"required",
      message:"No files found"
    }]);
  }
  let tags = req.body.tags;
  if(tags) {
    tags = tags.split(",");
  }
  const items = files.map(i=>{
    return {
      uri: i.location,
      userId,
      tags
    }
  });
  associator({req, files, items}, (error, data) => {
    if(error) return send500(res, error);
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
module.exports.getPhotoConfig = (env=process.env)=>{
  return {
    bucketName: env.ASSET_PHOTOS_BUCKET_NAME,
    uri: env.ASSET_PHOTOS_BASE_URI,
    maxPhotos: 3
  };
};
module.exports.generateFileKey = (now=Date.now) => (req, file, cb) => {
  const assetId = req.params.id;
  const ext = path.extname(file.originalname);
  const name = `${assetId}/${now()}${ext}`;
  cb(null, name);
};