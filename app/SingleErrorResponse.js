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
  unique:"unique",
  unauthorized:"unauthorized",
  notOpenForFunding:"not_open_for_funding",
  insufficientFunds:"insufficient_funds"
};
module.exports.SingleErrorResponse = SingleErrorResponse;
module.exports.InvalidRequestError = (document={code:"", param:"", message:""})=>{
  return new SingleErrorResponse(Object.assign({}, document, {
    type:"invalid_request_error"
  }));
}