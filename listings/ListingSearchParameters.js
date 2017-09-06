const defaults = {
  latitude:null,
  longitude:null,
  includeDeactivated: false,
  limit:20,
  offset:0
};
module.exports.build = function(customizations) {
  return Object.assign({}, defaults, customizations);
}
module.exports.defaults = defaults