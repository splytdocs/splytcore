module.exports.generateApprovalUri = (config=process.env)=>(accountCreated)=>{
  let baseUri = config.api_base_uri;
  const secret = config.demo_approval_secret_key;
  const userId = accountCreated._id;
  return `${baseUri}api/accounts/demo/approvals?userId=${userId}&secret=${secret}`
};
module.exports.generateMessage = (config=process.env, sanitized) => {
  const approvalUri = this.generateApprovalUri()(sanitized);
  return `
  <h2>New Request for Splyt Demo Access</h2>
  <ul>
  <li>Email: ${sanitized.email}</li>
  <li>Name: ${sanitized.name}</li>
  <li>Representing: ${sanitized.representing}</li>
  <li>Justification: ${sanitized.justification}</li>
  <li>Id: ${sanitized._id}</li>

  <li><a href="${approvalUri}">${approvalUri}</a></li>
  </ul>
  `;
};
module.exports.ses = (awsSes, config=process.env)=>(accountCreated, callback)=> {
  let sanitized = Object.assign({}, accountCreated);
  delete sanitized.password;
  let message = this.generateMessage(config, accountCreated)
  function send() {
    let to = config.demo_approval_email_to.split(",");
    let from = config.demo_approval_email_from;
    var params = {
     Destination: {
      BccAddresses: [], 
      CcAddresses: [], 
      ToAddresses: to
     }, 
     Message: {
      Body: {
       Html: {
        Charset: "UTF-8", 
        Data: message
       }, 
       Text: {
        Charset: "UTF-8", 
        Data: message
       }
      }, 
      Subject: {
       Charset: "UTF-8", 
       Data: config.demo_approval_email_subject
      }
     }, 
     ReplyToAddresses: [
     ], 
     Source: from
     //,SourceArn:"arn:aws:ses:us-east-1:667152756313:identity/alex@spl.yt"
    };
    awsSes.sendEmail(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
      callback(err, data);
    });
  }
  //console.log(message);
  send();
};
module.exports.notify = (methods=null)=>(accountCreated, collect=true) => {
  const output = [];
  if(methods) {
    const cb = collect? (err, data)=> {
      output.push(err||data);
    } : ()=>{};
    const exec = (i)=>i(accountCreated, cb);
    methods.forEach(exec);
  }
}