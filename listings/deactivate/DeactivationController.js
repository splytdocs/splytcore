module.exports.deactivateExpiredListings = (ListingDeactivator, ListingModel, blockchain) => (req, res, next) => {
  throw 'Not yet finished'
  const expiredListings = ListingDeactivator
    .findActiveExpiredListingsInStore(ListingModel)();
  const results = [];
  expiredListings.then((records) => {
    return listings.map((record)=> {
      const element = array[deactivateOnBlockchainAndStore];
      const listing = element.listing;
      const asset = element.asset;
      results.push(
        ListingDeactivator
          .expireOnBlockchainAndStore(blockchain, ListingModel)
          ({listing, asset})
      );
      return results;
    })
  }

}