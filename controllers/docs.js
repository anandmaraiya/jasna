/**
 * GET /docs
 * Docs page.
 */
exports.getIntro = function(req, res) {
  res.render('docs/intro', {
    title: 'Docs'
  });
};

/**
 * GET /docs/anomaly
 * Anomaly page.
 */
exports.getAnomaly = function(req, res) {
  res.render('docs/anomaly', {
    title: 'Anomaly'
  });
};

/**
 * GET /docs/APIs
 * APIs page.
 */
exports.getAPIs = function(req, res) {
  res.render('docs/APIs', {
    title: 'APIs'
  });
};

/**
 * GET /docs/connect
 * Connect DB page.
 */
exports.getConnect = function(req, res) {
  res.render('docs/connect', {
    title: 'Connect DB'
  });
};

/**
 * GET /docs/explore
 * Explore R, SQL , JS page.
 */
exports.getExplore = function(req, res) {
  res.render('docs/explore', {
    title: 'Explore'
  });
};

/**
 * GET /docs/JSppt
 * Web-PPT page.
 */
exports.getJSppt = function(req, res) {
  res.render('docs/JSppt', {
    title: 'Web-PPT'
  });
};