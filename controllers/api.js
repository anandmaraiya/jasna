var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var apiSecret = 'JASAB';
var child_process = require('child_process');
var fs = require('fs-extra');


/**

 * Split into declaration and initialization for better startup performance.
 */
var validator;
var request;

var wd = __dirname + '/public/';
var datadir = process.env.OPENSHIFT_DATA_DIR;
var Rloc = datadir+'R/bin/';


var RProcess = function(Rfile , file  , cb) { 
          var opts = {
          cwd: Rloc
              };    
          var workerProcess = child_process.exec( 'sh R --vanilla  < '+ Rfile +' --args '+ file, opts );
//          var workerProcess = child_process.exec( 'R.exe --vanilla < '+ Rfile  +' ' + file, opts );
          
          workerProcess.stdout.on('data', function (data) {
            cb(data);
              });
          workerProcess.stderr.on('data', function (data) {
            cb( data );
            });
          workerProcess.on('close', function (code) {
            cb('close');
            });
    };
/* 
  post /api/login
  send token after successful acct creation
  */

exports.checkToken = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SESSION_SECRET, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded._doc;
    next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }};
    

exports.postLogin = function(req, res, next) {

  var email = req.query.email;
  var pwd = req.query.password;
  email = req.sanitizeQuery('email').normalizeEmail();
  User.findOne({
            email: email
            }, function(err, user) {

            if (err) {res.json({success : 'false' , message : err}); return;}
            if (!user) {
              res.json({ success: 'false', message: 'Authentication failed. User not found.'});
              return;
            }  else {
                user.comparePassword(pwd, function(err,isMatch){
                 if (err) {res.json({ success :'false' , message :err}); return;} 
                 if(!(isMatch)){ 
                  res.json({ success: 'false', message: 'Authentication failed. Wrong password.' });
                  return; 
                 }  
              // create a token
                var token = jwt.sign(user, process.env.SESSION_SECRET, {
                  expiresIn: 10*60 // expires in 10*60 seconds
                });

              // return the information including token as JSON
                res.json({
                  success: true,
                  message: 'Enjoy your token!',
                  token: token
                });
                return;
             });
        }});
        };



/**
 * GET /api
 * List of API examples.
 */
exports.getR = function(req, res) {

   var Code = ''; 
   var Data = '';
   
  // check for authentication
  var id = req.decoded.email.toString().split('@',1);
  var query = req.query;
  //sendJson['query'] = query;
  if(query.code == null){ throw 'Error : No infomation about code is available in the query';}
  if(query.data != null) {
    // check for any data available 
  switch(query.data.type) {
    case 'JSON' :   
        // create a file for JSON data
        Data = wd+id+'/data/'+id+'.csv';
        fs.outputFile(Data, JsonToCSV(query.data.data));
        break;
    case 'FILE' : 
        // copy file to R folder
        Data = wd+id+'/data/'+query.data.data;
        //fs.copy(wd+id+'/data/'+Data,Rloc+Data);
        break;
    default : ;
      }
  }
  switch(query.code.type){
  case 'JSON':    // create a file for JSON code
          Code = wd+id+'/programs/'+id+'.R';
          str = 'outputText = "output.txt"\noutputPng  = "output.png"\nunlink(outputText)\nsink(file = outputText, append= FALSE , type=c("output","message"),split=FALSE)\ninput=parse(text="'+query.code.code+'")\neval(input)';
          fs.outputFile(Code, str);
          RProcess(Code , Data, function (data){
              if(data == 'close'){ 
                  var data1 = fs.readFileSync(Rloc+'output.txt','utf8');
                  res.json({success : 'true' , msg : data1});                  res.end(); 
                  return;}              
              });
          fs.copy(Rloc+'output.txt', wd+id+'/data/'+id+'.txt');
          fs.copy(Rloc+'output.png', wd+id+'/data/'+id+'.png');
          break;  
  
  case 'FILE':  
        Code = wd+id+'/programs/'+query.code.code;
        // copy code file to R folder
        RProcess(Code , Data, function (data){
          if(data == 'close'){
                  var data1 = fs.readFileSync(Rloc+'output.txt','utf8');
                  res.json({success : 'true' , msg : data1});                  res.end(); 
                  return;}              
              });
        break;
  default:  throw 'Error : No information about type of code . Please supply "STRING" or  "FILE"';
    }
  };
/**
 * GET /api/foursquare
 * Foursquare API example.
 */


/**
 * GET /api/facebook
 * Facebook API example.
 */

exports.getFileUpload = function(req, res, next) {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = function(req, res, next) {
  req.flash('success', { msg: 'File was uploaded successfully.'});
  res.redirect('/api/upload');
};

/**
 * GET /api/pinterest
 * Pinterest API example.
 */
