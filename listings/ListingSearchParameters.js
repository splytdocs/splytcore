const defaults = {
  latitude:null,
  longitude:null,
  includeDeactivated: false,
  limit:20,
  offset:0
};
function exists(o) {
  if(o===undefined) return false;
  if(o===null) return false;
  return true;
}
function existsAsN(o) {
  return exists(o) && !isNaN(o);
}
function withInty(o, cb) {
  if(existsAsN(o)) cb(parseInt(o, 10));
}
function withFloaty(o, cb) {
  if(existsAsN(o)) cb(parseFloat(o));
}
function withBooly(o, cb) {
  if(exists(o)) {
    if(o===true) { cb(true); return; }
    if(o===false) { cb(false); return; }
    if(isNaN(o)) {
      const asLowerString = o.toString().toLowerCase();
      if(asLowerString=="false") { cb(false); return; }
      if(asLowerString=="true") { cb(true); return }
      cb(!!o);
    } else {
      cb(!!parseInt(o, 10));
    }
  }
}
//const schema = {};
module.exports.build = function(customizations) {
  //return Object.assign({}, defaults, customizations);
  let output = Object.assign({}, defaults);
  if(customizations) {
    withInty(customizations.limit, (i)=>output.limit = i);
    withInty(customizations.offset, (i)=>output.offset = i);
    withFloaty(customizations.latitude, (i)=>output.latitude = i);
    withFloaty(customizations.longitude, (i)=>output.longitude = i);
    withBooly(customizations.includeDeactivated, 
      (i)=>output.includeDeactivated = i);
  }
  return output;
}
module.exports.defaults = defaults