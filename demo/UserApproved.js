function buildHtmlMessage({username, account_approved_login_uri}) {
  return `<h2>Welcome to Splyt!</h2>
  <p>Your account '${username}' has been approved.</p>

  <p>Use the link below to log in and start exploring our demo.</p>

  <a href="${account_approved_login_uri}" alt="Splyt website">${account_approved_login_uri}</a>
  `;
}
module.exports.makeUserApprovedNotifier = ({
  mailer,
  config: {
    account_approved_from,
    account_approved_bcc,
    account_approved_subject,
    account_approved_login_uri
  }
}) => {
  const results = {};
  results.send = (user, callback) => {
    const message = buildHtmlMessage({
      username:user.username,
      account_approved_login_uri
    });
    const to = user.email;
    mailer.sendMail({
      from: account_approved_from, 
      to: to,
      bcc: account_approved_bcc || "",
      subject: account_approved_subject,
      html: message
    }, (err, info) => {
      if (err) {
        console.error("Error sending UserApproved email:", err);
      } else {
        console.log(`UserApproved email sent to '${to}'`)
      }
      if (callback) 
        callback(err, info);
      }
    );
  };
  return results;
};