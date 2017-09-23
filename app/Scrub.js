module.exports.deleteMongoFields = (target)=>{
  delete target._id;
  delete target.__v;
  delete target.createdAt;
  delete target.updatedAt;
  return target;
};
module.exports.standardMongoScrub = (target)=>{
  const actualTarget = target._doc || target;
  let output = Object.assign({}, actualTarget);
  if(output._id) { output.id = output._id; }
  this.deleteMongoFields(output);
  return output;
};
module.exports.deleteSensitiveFields = (target)=>{
  if(target === null || target === undefined) return target;
  delete target.password;
  return target;
};