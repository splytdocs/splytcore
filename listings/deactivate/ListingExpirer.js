module.exports.makeExpirer = ({ListingModel, searcher, deactivator, blockchain, translator})=> {
  const output = {};
  output.findActiveExpiredListingsInStore = (thresholdDate=new Date()) => {
    return new Promise((resolve, reject)=>{
      searcher.searchByQuery({
        isActive: true, expirationDate:{$lt:thresholdDate}
      }).then(mapSearchResults, reject);

      function mapSearchResults(searchResults) {
        if(!searchResults || !searchResults.data) {
          resolve([]);
          return;
        } 
        const toResolve = searchResults.data.map(i=>{
          const out = {
            listing:Object.assign({}, i)
          };
          out.asset = out.listing.asset;
          delete out.listing.asset;
          out.listing.id = out.listing._id;
          out.asset.id = out.asset.id;
          return out;
        });
        resolve(toResolve);
      }
    });
  };
  output.markExpired = (documents=[]) => {
    const promises = []
    documents.forEach(i=>{
      const additionalChanges = {
        isExpired:true, 
        expiredAutomatically:{
          when:new Date()
        }
      };
      promises.push(
        deactivator(i, additionalChanges)
      );
    });
    return Promise.all(promises);
  };
  return output;
}