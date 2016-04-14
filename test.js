#!/bin/env node
//  OpenShift sample Node application
//external modules
var express = require('express');
var app = express();
var fs      = require('fs');
var bodyParser = require('body-parser');
var absorb = require('absorb');
var multer = require('multer');
var mustache = require('mustache'); // bring in mustache template engine
var child_process = require('child_process');  // not a module

//local places
var wd = __dirname + '/public/';
var datadir = process.env.OPENSHIFT_DATA_DIR;
var Rloc = datadir+'R/bin/';

	
//local variables
var body1 = bodyParser.urlencoded( {extended : true});
var body2 = bodyParser.json();
var upload1 = multer({ dest : wd+'uploads/UserData/'});
var upload2 = multer({ dest : wd+'uploads/UserRcode/'});



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
	
	var fetchToRepo = function(loc , file , callback){ 
					var fileTransfer = child_process.exec( 'cp '+loc+'/'+file+'  '+wd+'/uploads/UserData/'+file );			
					callback(wd+'/uploads/UserData/'+file);
					};
					
	var fetchToRbin = function(loc , file , callback){ 
					var fileTransfer = child_process.exec( 'cp '+loc+'/'+file+'  '+Rloc+'/'+file);
					callback(Rloc+'/'+file);
					};
	
	var RenameInRbin = function(fnameB , fnameA , callback){ 
					var fileTransfer = child_process.exec( 'mv '+Rloc+'/'+fnameB+'  '+Rloc+'/'+fnameA);
					callback(Rloc+'/'+fnameA);
					};
	var RenameInRepo = function(flocB , flocA , callback ){ 
					fs.rename( flocA , flocB, function(){ 
						callback (flocB);
						})
					/*
					var fileTransfer = child_process.exec( 'mv  '+wd+'uploads/UserData/'+fnameB.toString()+'   '+wd+'uploads/UserData/'+fnameA.toString() , function(err,stdout , stderr){ 
						if (err) { callback('Error in running child process');};
						if(stdout){ callback(wd+'uploads/UserData/'+fnameA.toString());};
						if(stderr){ callback('Error in Renaming');};
						});*/

					};
	
	app.get('/info' , function(req,res) {
			res.writeHead(200, {'content-type':'text/html'});
			res.write('<script> alert("' + Rloc + '");</script>');
			res.write('<script> alert("' + wd + '");</script>');		
			res.end();
			});	
	 	
	//fileUpload
	app.post('/fileUpload',upload1.single('userfile'), function (req, res) {
			if(req.file){
				fnameB = req.file.originalname;
				fnameA = req.file.filename;
//				res.writeHead(200,{'content-type' : 'text/html'});
				res.write('<script> alert("' + fnameA +' | '+fnameB +'");</script>');
				res.write('<script> alert("' + wd + '");</script>');		
				var newPath = wd + 'uploads/UserData/';
				fs.rename(newPath+fnameA, newPath+fnameB
							, function (err){ if (err) throw err;
											res.write('<img src="'+newPath +fnameB +'";/>');
											})
				res.end();
			}
			else {
				res.writeHead(200,{'content-type' : 'text/html'});
				res.write('<script> alert("' + req.file +'/uploads/UserData/' + '");</script>');
				res.write('<script> alert("' + wd + '");</script>');		
				res.end();
			}
		});
		/*
		if(req.file){
			res.writeHead(200, {'content-type':'text/html'});
			fnameB = req.file.originalname;
			fnameA = req.file.filename;
			RenameInRepo( fnameA , fnameB , function(body){
				res.write('<script> alert("UploadFile Renamed back to ' + body.toString() + '");</script>');
				});
			fetchToRbin(wd+'/uploads/UserData',fnameB , function (body) {
				res.write('<script> alert("UploadFile moved to ' + body.toString() + 'from '+wd+'/uploads/UserData/'+fnameB+'");</script>');
				});
			
			var workerProcess = child_process.exec( 'sh '+Rloc+'/R --vanilla  < '+Rloc+'/'+'mow.R');
			workerProcess.stdout.on('data', function (data,err) {
				if(err) console.log('error');
				console.log('stdout: ' + data);
				output = data;
				res.write('upload successful');
				fetchToRepo(Rloc,'current.png', function(){});
				res.write('<img src="/UserData/current.png'"/> <br>');
				res.end();	
				  });
		   workerProcess.stderr.on('data', function (data) {
				console.log('stderr: ' + data);
				res.write('<script>alert("Error while running R")</script><script> window.location="http://jasan-maraiya.rhcloud.com/index;</script>');
				res.end();		
				});
		   workerProcess.on('close', function (code) {
				console.log('child process exited with code ' + code);
				});
			}
	   else {
			res.writeHead(200, {'content-type':'text/html'});
			res.write('<script>alert("No datafile found for uploading")</script><script> window.location="http://jasan-maraiya.rhcloud.com/index";</script>');
			res.end();		
			}
		});
	
	
	//RCodeUpload		
	app.post('/RCodeUpload', upload2.single('userRcode'),function (req, res) {
		if(req.file){
			fnameB = req.file.originalname;
			fnameA = req.file.filename;
			fs.rename( wd+'/uploads/UserRcode/'+fnameA ,wd+ '/uploads/UserRcode/'+fnameB, function (err) {
		 
		res.writeHead(200, {'content-type':'text/html'});
		res.write('<script> alert("UploadFile Renamed back to ' + wd+'/uploads/UserRcode/'+fnameB + '");</script>');
			
			var child_process = require('child_process');
			var fileTransfer = child_process.exec( 'cp '+wd+ '/uploads/UserRcode/'+fnameB+' '+Rloc+'/'+fnameB);
			var workerProcess = child_process.exec( 'sh '+Rloc+'/R --vanilla  < '+Rloc+'/'+'mow.R' );

			   workerProcess.stdout.on('data', function (data,err) {
				  if(err) console.log('error');
				  console.log('stdout: ' + data);
				 // output = data;
					fetchToRepo(Rloc,'current.png', function(body){ 
					res.write('<img src="'+ body.toString()+'"/> <br>')});
					res.end();	
			   });
			    workerProcess.stderr.on('data', function (data) {
				  console.log('stderr: ' + data);
					res.write('<script>alert("'+data+'");</script><script> window.location="http://jasan-maraiya.rhcloud.com/index";</script>');
					res.end();		
			   });

			   workerProcess.on('close', function (code) {
				  console.log('child process exited with code ' + code);
			   });
			  });
			}
	   else {
			res.writeHead(200, {'content-type':'text/html'});
			res.write('<script>alert("No datafile found for uploading"); window.location="http://jasan-maraiya.rhcloud.com/index";</script>');
			res.end();
	   }
   });

   
/*  var newPath = wd + "/uploads/"+req.files.userfile.name;
  fs.writeFile(newPath, data, function (err) {
    console.log('Upload Successful');
	res.redirect('/index');
  });
  */


	
app.get("/*", function(req, res) {
		//res.writeHead(200, {'content-type':'text/html'});        
		res.redirect('/index');
		res.end();
		});

require('http').createServer(app).listen('9000',function(){console.log("App Started")});


	