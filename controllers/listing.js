/**
 * GET /listing
 */
exports.listingGet = function(req, res) {

  // TODO: Get all listing from DB and pass it to the render here
  res.render('listing', {
    title: 'Listing'
  });
};

/**
 * POST /listing
 */
exports.listingPost = function(req, res) {
  
  // TODO: Create a listing here
  transporter.sendMail(mailOptions, function(err) {
    req.flash('success', { msg: 'Thank you! Your feedback has been submitted.' });
    res.redirect('/listing');
  });
};
