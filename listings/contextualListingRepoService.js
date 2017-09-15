//var dotenv = require("dotenv");
module.exports.choose = function(env) {
  if(!env) env = process.env;
  const repoName = env.LISTING_REPO || "MongoDbRepository";
  const map = {
    "MongoDbRepository":function() {
      return require("./MongoDbRepository.js")
    }
  };
  if(map[repoName] == null) repoName = "MongoDbRepository";
  return map[repoName]();
};