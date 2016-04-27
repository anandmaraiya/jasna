/**
 * GET /visuals
 * Visuals page.
 */
exports.getIntro = function(req, res) {
  res.render('visuals/visuals', {
    title: 'Visuals'
  });
};
