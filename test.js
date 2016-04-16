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
var Ractive = require('ractive');
	Ractive.defaults.debug = false;
	Ractive.DEBUG = false;
	//Ractive.DEBUG_PROMISES = false;
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
// Create our Modal subclass


// Index
app.get('/index', function (req, res) {
res.sendFile(wd+"/index.html");   
 });
 
app.get('/intro', function (req,res){
	var Modal1 =	new basicModal();
	res.sendFile( Modal1.toHTML());	
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
var demoData =  { "title" : "JASAN",
					"records" : [{ // dummy data to display
								"name":"Steve Balmer",
								"company" : "Microsoft",
								"systems": [{
											"os":"Windows XP"},{
											"os":"Vista" },{
											"os":"Windows 7" },{
											"os":"Windows 8" }]
								},{
								"name" :"Steve Jobs",
								"company": "Apple",
								"systems" : [{
										"os":"OSX Lion" },{
										"os":"OSX Leopard" },{
										"os":"IOS"}]
								},{
								 "name" :"Mark Z.",
								 "company" : "Facebook"
								}]
				};


	

	//local vars
	var fnameA ='' ; var fnameB = '';
	var DefFile = 'default.csv' ; var DefRcode = 'default.R';
	var ftype = 'CSV';
	//local function
		
	// Alert on window
	var Alert = function(res , Msg, cb){
			var scr = '<script> alert("'+Msg+'");</script>';
			res.write(scr);
			if (cb) cb();
			};
			
	//R process 		
	var  RProcess = function(res , Rfile  , cb) { 
					var opts = {
					cwd: Rloc
							};
//					var workerProcess = child_process.exec( 'sh R --vanilla  < '+ Rfile , opts );
					var workerProcess = child_process.exec( 'Rscript.exe --vanilla  < '+ Rfile , opts );
					
					workerProcess.stdout.on('data', function (data) {
						cb(res, data);
						  });
					workerProcess.stderr.on('data', function (data) {
						cb(res, data );
						});
					workerProcess.on('close', function (code) {
						cb(res,'close');
						});
		};


	//SQL Process??

	
var data1 = {	"title" : "JASAN",
				"head" : { "intro" : "Welcome to JASAN",
                         	"body" : "Analytics @ Anywhere" },
				"foot" : {"intro" : "Footer",
                         	"body" : "Copyright @ Anand Maraiya <anand.maraiya@gmail.com>"},
				"modal" : [{ "intro"  : "Reports, Plots, Tables, Text, Html, Pdf",
								"elId" : "mdlOutput",
								"body" : [{"msg" : "First Message"},  {"msg" : "Second Message"}]			
								}]		
			};

//mypage 
 app.get('/mypage' , function  (req,res){
			var head = new Ractive({
				el : 'header',
				template: function(){var tmpl = fs.readFileSync(wd+'/header.html','utf8' );
								return tmpl;},
				data : data1
			});
			var	foot = new Ractive({
				el : 'footer',
				template: function(){var tmpl = fs.readFileSync(wd+'/footer.html','utf8' );
								return tmpl;},
				data : data1
			});
			var	Modal = new Ractive({
				el : 'modal',
				template: function(){var tmpl = fs.readFileSync(wd+'/modal.html','utf8' );
								return tmpl;},
				data : data1
			});
			res.send(head.toHTML()+Modal.toHTML()+foot.toHTML());
			 res.end();
 });
	

	
	//get /main
		app.get('/userLab/:id' , function( req, res){
				//var id = req.params.id;
				//console.log(id);

				var page = fs.readFileSync(wd+'/mypage.html','utf8' );
				var ractive = new Ractive({
					el : 'body',
					template: page,
					data : demoData
						});			 
				res.send(ractive.toHTML());
				 res.end();
			 });

					/*			function(){ RProcess(res ,'mow.R'   
					, function(res, body){ Alert(res,body 
						, function(res,body){ if(body=='close') {res.end();}});
						});
					});
		*/	

	
	// get /info
		app.get('/info' , function(req,res) {
			Alert(res,wd
				, function (){Alert(res, Rloc 
								, function() 
									{ res.end();
								});
				});
			});	

 	 var err  = ''; 
	//post /fileUpload
	app.post('/fileUpload',upload1.array('userfile',5), function (req, res ) {
			err= '';
			console.log(req.files);
			if( req.files.length == 0) { err = 'No files to upload'; console.log(err);}
			for ( var i= 0 ; i < req.files.length ; i++ ){
					var file = req.files[i];
					if(file.size > 10485760) { err =  req.file.originalname +' filesize exceeds 10 MB. Sorry, cant allow.'; console.log(err);  };
					}
				if(err != '' ) { Alert(res, err); console.log(err); res.end('<script> window.location="/index";</script>');}
				else {
				Alert( res, 'File(s) uploaded successfully'
				, function () { res.write('<script> window.location="/userLab/'+UserId+'";</script>') ;
				console.log('ready to redirect');
				res.end();
				});
				}
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


	