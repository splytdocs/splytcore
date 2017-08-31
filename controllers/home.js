var mongoose = require('mongoose')
var Listing = require("../models/Listing");

/**
 * GET /
 */
exports.index = function(req, res) {

  Listing.find().exec( (err, result) => {
    console.log(result)
    console.log('hello')
    res.render('home', {
      title: 'Home',
      listings: result
    });
  })
};
