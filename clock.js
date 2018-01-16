
var mongoose = require('mongoose');
// Load environment variables from .env file
if(process.env.NODE_ENV !== 'production') {
  var dotenv = require('dotenv');
  dotenv.load();
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
if(process.env.DEBUG_MONGODB) mongoose.set('debug', true);

const ListingRepo = require("./models/Listing");
const ListingModel = ListingRepo;
const ListingDeactivator = require("./listings/deactivate/ListingDeactivator");
const ListingExpirer = require("./listings/deactivate/ListingExpirer");
const blockchain = require("./controllers/ethereum");
const listingsRepo = require("./listings/contextualListingRepoService").choose();

const deactivator = ListingDeactivator.deactivateOnBlockchainAndStore(blockchain, ListingModel);

const expirer = ListingExpirer.makeExpirer({
  ListingModel,
  searcher:listingsRepo,
  deactivator, 
  blockchain
});
const runExpireJob = ()=>{
  console.log(`Expire job: Running expire job`, new Date());
  expirer.findActiveExpiredListingsInStore()
    .then(onFound, onError);
  function onFound(searchResults) {
    if(!searchResults || !searchResults.length) {
      return console.log("Expire job: No expired records to process");
    }
    console.log(`Expire job: attempting to process ${searchResults.length} listings`)

    const mapped = searchResults;
    expirer.markExpired(mapped)
      .then(onSuccessfulExpiration, onFailedExpiration);
  }
  function onError(error) {
    console.warn("Expire job: error", error);
  }
  function onSuccessfulExpiration(successes) {
    if(successes==null) successes=[];
    const getid=(i)=>{
      const listing = i.documents.listing;
      if(listing.id) return listing.id;
      if(listing._id) return listing._id;
      return "???";
    }
    const out = {
      success:true,
      succeeded:successes.map(getid),
      failed:[]
    };
    console.log("Expire job: successful result", out);
  }
  function onFailedExpiration(results) {
    console.warn("Expire job: failed result", results);
  }
};

let expireJobFrequency = 60000;
if(process.env.expire_job_frequency) {
  expireJobFrequency = parseInt(process.env.expire_job_frequency, 10);
}
console.log("expireJobFrequency:", expireJobFrequency);
if(expireJobFrequency == -1) {
  console.warn("Not running or scheduling expire job because the frequency is set to -1.")
}
setInterval(runExpireJob, expireJobFrequency);
runExpireJob();