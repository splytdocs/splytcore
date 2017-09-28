const S3Photos = require("./S3Photos")
const upload = S3Photos.upload;
const translateResponse = S3Photos.translateResponse;

describe('upload', () => {
  it('it calls aws.putObject with {Key: imageName, Body: imageFile, Bucket:s3Bucket} and callback', () => {
    const aws = {
      putObject:jest.fn()
    };
    const imageFile = "fakecontents";
    const imageName = "abcdefg.jpg";
    const bucketName = "bucketname"
    const callback = jest.fn();
    upload(aws)({imageName, imageFile, bucketName}, callback);
    expect(aws.putObject).toHaveBeenCalledWith({
      Key:imageName, 
      Body:imageFile,
      Bucket:bucketName
    }, callback);
  });
});
describe('translateResponse', () => {
  it('should append the imageName onto the end of the baseUri in cfg.bucketUri', () => {
    const cfg = {bucketUri:'https://fakebucket.s3-us-east-1.amazonaws.com/'};
    const imageName = "abcdefg.jpg";
    const results = translateResponse(cfg)({imageName});
    expect(results)
      .toEqual('https://fakebucket.s3-us-east-1.amazonaws.com/abcdefg.jpg');
  });
});