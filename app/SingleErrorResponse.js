class SingleErrorResponse {
  constructor(document) {
    Object.assign(this, {
      code:"",
      param:"",
      type:"",
      message:""
    }, document);
  }
}
module.exports.codes = {
  unique:"unique"
};
module.exports.SingleErrorResponse = SingleErrorResponse;
module.exports.InvalidRequestError = (document)=>{
  return new SingleErrorResponse(Object.assign({}, document, {
    type:"invalid_request_error"
  }));
}