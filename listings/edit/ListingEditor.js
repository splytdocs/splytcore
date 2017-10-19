const SingleErrorResponse = require("../../app/SingleErrorResponse");

module.exports.makeStateValidator = () => {
  const output = {};
  output.canBeEdited = (models) => {
    return models.asset.ownership.stakes.length == 0;
  }
  output.describeEditability = (models) => {
    if (output.canBeEdited(models)) 
      return [];
    return [SingleErrorResponse.InvalidRequestError({code: "not_editable_funded", message: "This listing has funding applied and cannot be edited."})];
  };
  output.describeOrigin = (listing, authenticatedUserId) => {
    const originError = [SingleErrorResponse.InvalidRequestError({
      code: SingleErrorResponse.codes.unauthorized, 
      message: "You are not authorized to edit this Listing."
    })];
    if(!authenticatedUserId) {
      return originError;
    }
    if(listing.listedByUserId == authenticatedUserId) {
      return [];
    }
    return originError;
  };
  return output;
}
module.exports.makeRepo = ({AssetModel,ListingModel}) => {
  const output = {};
  output.find = (listingId)=>{
    return new Promise((resolve, reject)=>{
      const results = {
        asset:{}, listing:{}  
      };
      function findListing() {
        ListingModel.findById(listingId, (error, data)=>{
          if(error) return reject({errors:[error]});
          results.listing = data;
          findAsset(data.assetId);
        });
      }
      function findAsset(assetId) {
        AssetModel.findById(assetId, (error, data)=>{
          if(error) return reject({errors:[error]});
          results.asset = data;
          resolve(results);
        });
      }
      findListing();
    });
  };
  function massageBeforeChanging (listingChanges, assetChanges) {
    if(listingChanges.location) {
      listingChanges.location.coordinates = [listingChanges.location.longitude, listingChanges.location.latitude];
    }
    listingChanges.title = assetChanges.title;
    delete listingChanges.asset;
  }
  output.massageBeforeChanging = massageBeforeChanging;
  output.applyChanges = (old, changes)=> {
    return new Promise((resolve, reject)=>{
      const listingChanges = Object.assign({}, changes);
      const assetChanges = Object.assign({}, changes.asset);
      massageBeforeChanging(listingChanges, assetChanges);

      saveListing();

      function rejectWith(error) {
        reject(error);
      };
      const afterChanges = {};
      function saveListing() {
        ListingModel.findByIdAndUpdate(old.listing._id, 
          listingChanges, {
            new:true, upsert:false,
            runValidators: true
          }, (error, data) => {
            if(error) return rejectWith(error);
            afterChanges.listing = data;
            saveAsset();
        });
      }
      function saveAsset() {
        AssetModel.findByIdAndUpdate(old.asset._id,
          assetChanges, {
            new:true, upsert:false,
            runValidators: true
          }, (error, data) => {
            if(error) return rejectWith(error);
            afterChanges.asset = data;
            resolve(afterChanges);
        });
      }
    });
  };
  return output;
};
module.exports.makeBlockchain = (ethereum) => {
  const output = {};
  output.applyChanges = ({listing,asset})=>{
    return new Promise((resolve, reject)=>{
      // TODO: Make blockchain changes here
      // put anything you want to return into `blockchain` object
      const blockchain = {};
      resolve({listing,asset,blockchain})
    });
  };
  return output;
};
module.exports.makeEditor = ({repo, schemaValidator, stateValidator, blockchain}) => {
  const output = {};
  output.edit = (target, authenticatedUserId) => {
    return new Promise((resolve___, reject___) => {
      // validate schema validate listing & asset exist and are editable (no money
      // allocated) apply changes to objects attempt to save to DB attempt to save to
      // blockchain
      const resolve = (i)=>{resolve___(i)}
      const rejectWith = (errors, message) => {
        const op = new Error(message);
        op.errors = errors;
        reject___(op);
      };
      const summary = schemaValidator.validate(target);
      if (summary.length) {
        rejectWith(summary, 'Invalid schema');
        return;
      }
      handleLookup();

      function handleLookup() {
        const found = repo.find(target.id);
        found.catch((reason)=>rejectWith(reason));

        found.then((changes)=>{
          onModelsFound(changes, target);
        });
      }
      function onModelsFound(old, changes) {
        const editable = stateValidator.describeEditability(old);
        if (editable && editable.length) {
          rejectWith(editable, 'Not editable');
          return;
        }
        const authorized = stateValidator.describeOrigin(old.listing, authenticatedUserId);
        if(authorized && authorized.length) {
          rejectWith(authorized, 'Unauthorized');
          return;
        }
        handleChangeApplication(old, changes);
      }
      function handleChangeApplication(old, changes) {
        const results = repo.applyChanges(old, changes);
        results.catch(reason=>rejectWith(reason));
        results.then((afterChangesApplied) => {
          handleBlockchainApplication(old, changes, afterChangesApplied);
        });
      }
      function handleBlockchainApplication(old, changes, afterChangesApplied) {
        const results = blockchain.applyChanges(old, changes, afterChangesApplied);
        results.catch(reason=>rejectWith(reason));
        results.then((blockchainChanges)=>{
          resolve(blockchainChanges);
        });
      }
    })
  };
  return output;
};
