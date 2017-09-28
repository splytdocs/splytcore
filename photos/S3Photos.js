module.exports.upload = aws => ({imageName, imageFile, bucketName}, callback) => {
  aws.putObject({
    Key:imageName,
    Body:imageFile,
    Bucket:bucketName
  }, callback);
};
module.exports.translateResponse = cfg => ({err, data, imageName}) => {
  return cfg.bucketUri + imageName;
};