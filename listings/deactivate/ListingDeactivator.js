module.exports.markStoreAsDeactivated = (ListingModel) => (id, additionalChanges={}) => {
  const changes = Object.assign({}, {
    isActive: false
  }, additionalChanges);
  return ListingModel.findByIdAndUpdate(id, changes);
};
module.exports.deactivateOnBlockchainAndStore = (blockchain, ListingModel) => (documents={listing, asset}, additionalChanges={}) => {
  return new Promise((resolve, reject)=>{
    // The blockchain.deactivate call would presumably 
    // handle refunds (if present) and marking the appropriate
    // fields on the blockchain. The DB updates should happen only if
    // the blockchain updates succeed
    
    const blockchainDeactivate = () => {
      blockchain.deactivate(documents)
        .then(databaseDeactivate, (err) => {
          const output = new Error('Error saving to blockchain');
          output.inner = err;
          reject(output);
        });
    }
    const databaseDeactivate = (blockchainResults) => {
      this.markStoreAsDeactivated(ListingModel)
        (documents.listing.id, additionalChanges)
        .then((i)=>{
          resolve({documents,i,blockchainResults});
        }, (i)=>reject(i));
    }
    blockchainDeactivate();
  });
};
module.exports.manuallyUnlistOnBlockchainAndStore = (blockchain, ListingModel) => (documents={listing, asset}, additionalChanges={wasManuallyUnlisted:true}) => {
  // Handler for when the Lister decides to manually end the listing
  return this.deactivateOnBlockchainAndStore(blockchain, ListingModel)(documents, additionalChanges);
};