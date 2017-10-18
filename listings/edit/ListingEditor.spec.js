const ListingEditor = require("./ListingEditor");
const makeEditor = ListingEditor.makeEditor;
const promised = (resolveWith)=>{
  return new Promise((resolve, reject)=>{
    resolve(resolveWith);
  });
};
const rejected = (rejectWith)=>{
  return new Promise((resolve, reject)=>{
    reject(rejectWith);
  });
};
const mockedSuccessfulDependencies = ({models={listing:{}, asset:{}}, blockchainResults={}})=> {
  return {
    schemaValidator:{
      validate:jest.fn().mockReturnValue([]),
    },
    stateValidator:{
      describeEditability:jest.fn().mockReturnValue([]),
      describeOrigin:jest.fn().mockReturnValue([])
    },
    repo:{
      find:jest.fn().mockReturnValue(promised(models)),
      applyChanges:jest.fn().mockReturnValue(promised(models))
    },
    blockchain:{
      applyChanges:jest.fn()
        .mockReturnValue(promised(blockchainResults))
    }
  };
};

describe('holistic', () => {
  it('should resolve with blockchain results when all dependencies mocked for success', (done) => {
    const blockchainResults = {blockchain:{}};
    const dependencies = mockedSuccessfulDependencies({blockchainResults})
    const results = makeEditor(dependencies).edit({}, "userid"); 
    results.then((output)=>{
      expect(dependencies.schemaValidator.validate).toHaveBeenCalledTimes(1);
      expect(dependencies.stateValidator.describeEditability).toHaveBeenCalledTimes(1);
      expect(dependencies.stateValidator.describeOrigin).toHaveBeenCalledTimes(1);
      expect(dependencies.repo.find).toHaveBeenCalledTimes(1);
      expect(dependencies.repo.applyChanges).toHaveBeenCalledTimes(1);
      expect(dependencies.blockchain.applyChanges).toHaveBeenCalledTimes(1);

      expect(output).toBe(blockchainResults);
      done();
    });
  });
});

describe('validator', () => {
  
  describe('.validate', () => {
    it('should reject with {errors} when validator.validate returns errors', (done) => {
      const errors = [{message:"Invalid data"}]
      const schemaValidator = {validate:jest.fn().mockReturnValue(errors)};
      const result = makeEditor({schemaValidator}).edit({});
      result.catch(reason=>{
        expect(reason.errors).toEqual(errors);
        done();
      });
    });
  });

  describe('.describeEditability', () => {
    it('should reject with {errors} when validator.describeEditability returns errors', (done) => {
      const errors = [{message:"Invalid data"}];
      const dependencies = mockedSuccessfulDependencies({});
      dependencies.stateValidator.describeEditability = jest.fn().mockReturnValue(errors);
      const result = makeEditor(dependencies).edit({});
      result.catch(reason=>{
        expect(reason.errors).toEqual(errors);
        done();
      });
    });
  });
  
  describe('.describeOrigin', () => {
    it('should reject with {errors} when validator.describeOrigin returns errors', (done) => {
      const errors = [{message:"Invalid data"}];
      const dependencies = mockedSuccessfulDependencies({});
      dependencies.stateValidator.describeOrigin = jest.fn().mockReturnValue(errors);
      const result = makeEditor(dependencies).edit({});
      result.catch(reason=>{
        expect(reason.errors).toEqual(errors);
        done();
      });
    });
  });
  describe('repo', () => {
    describe('.find', () => {
      it('should reject with {errors} when repo.find returns errors', (done) => {
        const errors = [{message:"Invalid data"}];
        const dependencies = mockedSuccessfulDependencies({});
        dependencies.repo.find = jest.fn().mockReturnValue(rejected(errors));
        const result = makeEditor(dependencies).edit({id:"abcdefg"}); 
        result.catch(reason=>{
          expect(reason.errors).toEqual(errors);
          expect(dependencies.repo.find).toHaveBeenCalledWith("abcdefg");
          done();
        });
      });
    });
    describe('.applyChanges', () => {
      it('should reject with {errors} when repo.applyChanges returns errors', (done) => {
        const errors = [{message:"Invalid data"}];
        const models = {};
        const dependencies = mockedSuccessfulDependencies({models});
        dependencies.repo.applyChanges = jest.fn().mockReturnValue(rejected(errors));
        const result = makeEditor(dependencies).edit({id:"abcdefg"}); 
        result.catch(reason=>{
          expect(reason.errors).toEqual(errors);
          expect(dependencies.repo.applyChanges)
            .toHaveBeenCalledWith({},{id:"abcdefg"});
          done();
        });
      });
    });
    describe('.massageBeforeChanging', () => {
      it('should set listing.title to asset.title', () => {
        const models = {
          listing:{},
          asset:{title:"This is a title"}
        };
        const AssetModel = {
          findById:jest.fn().mockImplementation((i, cb)=>cb(null, asset))
        };
        const ListingModel = {
          findById:jest.fn().mockImplementation((i, cb)=>cb(null, listing))
        };
        const repo = ListingEditor.makeRepo({AssetModel,ListingModel});
        // This mutates so we just check the same object
        repo.massageBeforeChanging(models.listing, models.asset);
        expect(models.listing.title)
            .toEqual(models.asset.title);
      });
      it('should set listing.location.coordinates to asset.location[long,lat]', () => {
        const models = {
          listing:{
            location:{
              latitude:1,
              longitude:2
            }
          },
          asset:{}
        };
        const AssetModel = {
          findById:jest.fn().mockImplementation((i, cb)=>cb(null, asset))
        };
        const ListingModel = {
          findById:jest.fn().mockImplementation((i, cb)=>cb(null, listing))
        };
        const repo = ListingEditor.makeRepo({AssetModel,ListingModel});
        // This mutates so we just check the same object
        repo.massageBeforeChanging(models.listing, models.asset);
        expect(models.listing.location.coordinates)
            .toEqual([2,1]);
      });
    });
  });

  describe('blockchain', () => {
    describe('.applyChanges', () => {
      it('should reject with {errors} when blockchain.applyChanges returns errors', (done) => {
        const errors = [{message:"Invalid data"}];
        const models = {};
        const dependencies = mockedSuccessfulDependencies({models});
        dependencies.blockchain.applyChanges = jest.fn().mockReturnValue(rejected(errors));
        const result = makeEditor(dependencies).edit({id:"abcdefg"}); 
        result.catch(reason=>{
          expect(reason.errors).toEqual(errors);
          expect(dependencies.blockchain.applyChanges)
            .toHaveBeenCalledWith({},{id:"abcdefg"},{});
          done();
        });
      });
    });
  });
});

describe('makeValidator', () => {
  describe('.canBeEdited', () => {
    it('should return true when asset has no claims', () => {
      const validator = ListingEditor.makeStateValidator();
      const models = {asset:{
        ownership:{stakes:[]}
      }};
      expect(validator.canBeEdited(models)).toBeTruthy();
    });
    
    it('should return false when asset has claims', () => {
      const validator = ListingEditor.makeStateValidator();
      const models = {asset:{
        ownership:{stakes:[{
          userId:"whatever",amount:1
        }]}
      }};
      expect(validator.canBeEdited(models)).toBeFalsy();
    });
  });
  describe('.describeEditability', () => {
    it('should return an empty array when asset has no claims', () => {
      const validator = ListingEditor.makeStateValidator();
      const models = {asset:{
        ownership:{stakes:[]}
      }};
      expect(validator.describeEditability(models)).toEqual([]);
    });
    it('should return an array with an appropriate error when asset has claims', () => {
      const validator = ListingEditor.makeStateValidator();
      const models = {asset:{
        ownership:{stakes:[{
          userId:"whatever",amount:1
        }]}
      }};
      expect(validator.describeEditability(models)).toEqual([{
        code:"not_editable_funded",
        message:"This listing has funding applied and cannot be edited.",
        param:"",
        type:"invalid_request_error"
      }])
    });
  });
  describe('.describeOrigin', () => {
    it('should return an empty array when listing.listedByUserId != authenticatedUserId', () => {
      const validator = ListingEditor.makeStateValidator();
      const models = {
        listing:{listedByUserId:"abcdef"}
      };
      const results = validator.describeOrigin(models.listing, "abcdef")
      expect(results).toEqual([]);
    });
    it('should return an array with an appropriate error when asset has claims', () => {
      const validator = ListingEditor.makeStateValidator();
      const models = {
        listing:{
          createdByUserId:"notmatching",
        }
      };

      const results = validator.describeOrigin(models.listing, "abcdef")
      expect(results).toEqual([{
        code:"unauthorized",
        message:"You are not authorized to edit this Listing.",
        param:"",
        type:"invalid_request_error"
      }])
    });
  });
});

describe('makeRepo', () => {
  describe('.find', () => {
    it('should resolve with {listing,asset} when mocked for success', (done) => {
      const listing = {id:"xyz", assetId:"abc"}, asset = {id:"abc"};
      const AssetModel = {
        findById:jest.fn().mockImplementation((i, cb)=>cb(null, asset))
      };
      const ListingModel = {
        findById:jest.fn().mockImplementation((i, cb)=>cb(null, listing))
      };
      const repo = ListingEditor.makeRepo({AssetModel,ListingModel})
      const results = repo.find(listing.id);

      results.then(i=>{
        expect(i).toEqual({listing,asset});
        done();
      });
      results.catch(i=>{
        fail("Should not reach this catch");
        done();
      });
    });
    it('should reject when ListingModel is mocked to fail', (done) => {
      const listing = {id:"xyz", assetId:"abc"}, asset = {id:"abc"};
      const ListingModel = {
        findById:jest.fn().mockImplementation((i, cb)=>cb({message:"error"}, null))
      };
      const repo = ListingEditor.makeRepo({AssetModel:null,ListingModel})
      const results = repo.find(listing.id);
      results.catch(i=>{
        expect(i).toEqual({errors:[{message:"error"}]});
        done();
      });
      results.then(i=>fail("Should not resolve"));
    });
    it('should reject when AssetModel is mocked to fail', (done) => {
      const listing = {id:"xyz", assetId:"abc"}, asset = {id:"abc"};
      const AssetModel = {
        findById:jest.fn().mockImplementation((i, cb)=>cb({message:"error"}, null))
      };
      const ListingModel = {
        findById:jest.fn().mockImplementation((i, cb)=>cb(null, listing))
      };
      const repo = ListingEditor.makeRepo({AssetModel,ListingModel})
      const results = repo.find(listing.id);
      results.catch(i=>{
        expect(i).toEqual({errors:[{message:"error"}]});
        done();
      });
      results.then(i=>fail("Should not resolve"));
    });
  });
});