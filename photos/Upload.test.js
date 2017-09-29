const Upload = require("./Upload");
const getPhotoConfig = Upload.getPhotoConfig;

describe('getPhotoConfig', () => {
  it('returns expected results using passed env', () => {
    const env = {
      ASSET_PHOTOS_BUCKET_NAME:"bucket",
      ASSET_PHOTOS_BASE_URI:"uri",
    }
    const config = getPhotoConfig(env);
    expect(config).toEqual({
      bucketName: env.ASSET_PHOTOS_BUCKET_NAME,
      uri: env.ASSET_PHOTOS_BASE_URI,
      maxPhotos: 3
    });
  });
  it('returns expected results using process.env', () => {
    const config = getPhotoConfig();
    expect(config).toEqual({
      bucketName: process.env.ASSET_PHOTOS_BUCKET_NAME,
      uri: process.env.ASSET_PHOTOS_BASE_URI,
      maxPhotos: 3
    });
  });
});
describe('generateFileKey', () => {
  it(`should use now(), req.params.id, and file.originalname's extension to generate a useful s3 key`, () => {
    const now = () => "now";
    const assetId = "79283";
    const file = {originalname:"something.jpg"};
    const req = {params:{id:assetId}};
    Upload.generateFileKey(now)(req, file, (error, data) => {
      expect(data).toEqual("79283/now.jpg");
    });
  });
});