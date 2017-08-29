var dotenv = require("dotenv");
module.exports.choose = function(env) {
  if(!env) env = dotenv.config();
  const repoName = env.LISTING_REPO || "MockDataRepository";
  const map = {
    "MockDataRepository":function() {
      return require("./MockDataRepository.js");
    },
    "MongoDbRepository":function() {
      return require("./MongoDbRepository.js")
    }
  }
  return map[repoName]();
};