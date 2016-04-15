#!/bin/env node
//  OpenShift sample Node application
//external modules
var express = require('express');
var app = express();
var fs   = require('fs-extra');
var bodyParser = require('body-parser');
var absorb = require('absorb');
var multer = require('multer');
var mustache = require('mustache'); // bring in mustache template engine
var child_process = require('child_process');  // not a module
var UserId = 'ram';
//local places
var wd = __dirname + '/public/';
var datadir = process.env.OPENSHIFT_DATA_DIR;
var Rloc = 'C:/R/bin/';
	
//local variables
var body1 = bodyParser.urlencoded( {extended : true});
var body2 = bodyParser.json();
var storage1 = multer.diskStorage({
  destination: wd+UserId+'/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload1 = multer({ storage : storage1 });


app.use(express.static(wd));
//Routes

// Index
app.get('/index', function (req, res) {
res.sendFile(wd+"/index.html");   
 });

 // <!-- Api
 
 app.get('/api' , function(req,res){
	 res.json({ message : 'Hello world'})
 });

 app.get('/api/:id'  , function(req,res){
	 // use req.params
	 console.log(req.params.id);
		var id = 'world';
		id = req.params.id;
	res.json({ message : id });
 });
 
 app.post('/api' , function(req,res){
	 // use req.query
	 console.log(req.query);
	 var sendJson = { message : 'Hello'};
		console.log(sendJson);
	if(req.query.id) { sendJson = absorb(sendJson,{ id : req.query.id} );}

	if(req.query.name) {  sendJson = absorb(sendJson,{ name : req.query.name});}
	res.json(sendJson);
 });


 app.put('/api' , function(req,res){
	 res.json({ message : 'Hello world'})
 });

 app.delete('/api' , function(req,res){
	 res.json({ message : 'Hello world'})
 });

 // --> Api
 
 //mypage JSON data 
var demoData = [{ // dummy data to display
"name":"Steve Balmer",
"company": "Microsoft",
"systems": [{
"os":"Windows XP"
},{
"os":"Vista"
},{
"os":"Windows 7"
},{
"os":"Windows 8"
}]
},{
"name":"Steve Jobs",
"company": "Apple",
"systems": [{
"os":"OSX Lion"
},{
"os":"OSX Leopard"
},{
"os":"IOS"
}]
},{
"name":"Mark Z.",
"company": "Facebook"
}];

//mypage 
 app.get('/mypage' , function  (req,res){
	
	var rData = {records : demoData};
	 var page = fs.readFileSync(wd+'/mypage.html','utf8' );
	 console.log(page);
	 var html = mustache.to_html(page,rData);
	
	 res.send(html);
	 res.end();
	console.log('/mypage  loaded')	
 });
	
	
	

	//local vars
	var fnameA ='' ; var fnameB = '';
	var DefFile = 'default.csv' ; var DefRcode = 'default.R';
	var ftype = 'CSV';
	//local function
		
	var Alert = function(res , Msg, cb){
			var scr = '<script> alert("'+Msg+'");</script>';
			res.write(scr);
			if (cb) cb();
			};
			
	var  RProcess = function(res , Rfile  , cb) { 
					var opts = {
					cwd: Rloc
							};
//					var workerProcess = child_process.exec( 'sh R --vanilla  < '+ Rfile , opts );
					var workerProcess = child_process.exec( 'R.exe --vanilla  < '+ Rfile , opts );
					
					workerProcess.stdout.on('data', function (data) {
						Alert(res, data , function() {});
						  });
				   workerProcess.stderr.on('data', function (data) {
						Alert(res, data , function() {});
						});
				   workerProcess.on('close', function (code) {
						Alert(res, 'R process closed'+code , function() {});
						});
		}
	/*	
	var FSMove	=  function( src , dest , callback) {
					fs.copy(src, dest 
							, function (err){
											if (err) { callback('cannot copy or read the file'); return;}
											fs.remove(src 
												, function (err) {if (err) callback('cannot remove earlier version of src file'+ err);
													callback('Moving file successful');
												});
										});
					}
	
	var FSCopy	=  function( src , dest , res , callback) {
					fs.copy(src, dest 
							, function (err){
											if (err) { Alert( res, err , function(){ res.end();});}
													Alert(res , 'Copying file successful');
													callback();
												});
										};	
	*/

	app.get('/info' , function(req,res) {
			res.writeHead(200, {'content-type':'text/html'});
			Alert(res,wd
				, function (){Alert(res, Rloc , function() 
												{ res.end();
												}
									);
							}
					);
			});	

 	
	//fileUpload
	app.post('/fileUpload',upload1.array('userfile',5), function (req, res ) {
			

			res.writeHead(200, {'content-type':'text/html'});
			Alert(res,'HI', 
				function(){ RProcess(res ,'mow.R'   
					, function(res, body){ Alert(res,body 
						, function(){});
						});
					});
			});

/*	
	app.post('/RCodeUpload',upload1.array('userfile',5), function (req, res ) {
		res.writeHead(200, {'content-type':'text/html'});
		if(!req.file){
			Alert(res, 'No R Code received', function(){};)
			}
		else {Alert(res,'Rcode Uploading'
				, function() { FSMove(wd+UserId+'/uploads/'+req.file.filename , wd+UserId+'/uploads/'+req.file.originalname , res, 			
					, function(){ RProcess('mow.R' , res  
						, function(res, body){ Alert(res,body 
							, function(){});
							});
						});
					});
			}
		});
	*/
app.get("/*", function(req, res) {
		//res.writeHead(200, {'content-type':'text/html'});        
		res.redirect('/index');
		res.end();
		});

require('http').createServer(app).listen('9000',function(){console.log("App Started")});


	