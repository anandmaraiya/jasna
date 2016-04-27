var User = require('../models/User');


/**
 * GET /account/userLab
 * UserLab page.
 */
exports.getUserLab = function(req, res) {
  res.render('userLab/userLab', {
    title: 'UserLab'
  });
};
