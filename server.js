#!/bin/env node
//  OpenShift sample Node application
//external modules
var express = require('express');
var app = express();
var fs      = require('fs-extra');
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
	 	
	//fileUploa
	app.post('/fileUpload',upload1.single('userfile'), function (req, res) {
			if(req.file){
				res.writeHead(200,{'content-type' : 'text/html'});
			
				fnameB = req.file.originalname;
				fnameA = req.file.filename;
//				res.writeHead(200,{'content-type' : 'text/html'});
				res.write('<script> alert("' + fnameA +' | '+fnameB +'");</script>');
				res.write('<script> alert("' + wd + '");</script>');		
				var newPath = wd + 'uploads/UserData/';
				fs.copy(newPath+fnameA, newPath+fnameB
							, function (err){ 
											res.write('<img src="/uploads/UserData/' +fnameB +'" />');
											res.end();
											fs.remove(newPath+fnameA 
												, function (err) {if (err) throw err;
												});
							});
				var workerProcess = child_process.exec( 'sh '+wd+'../../data/R/bin/R --vanilla  < '+wd+'../../data/R/bin/mow.R' , function (err) { res.write('<script> alert("'+err+'");</script>')});
					workerProcess.stdout.on('data', function (data,err) {
						if(err) {res.write('<script> alert(" Error : Shelling R ' + wd + '../../data/R/bin/R");</script>'); 
						 res.end();}
						console.log('stdout: ' + data);
						output = data;
						res.write('R running successfully');
						res.write('<img src="'+wd+'/../../data/R/bin/current.png"/> <br>');
						res.end();	
						  });
				   workerProcess.stderr.on('data', function (data) {
						res.write('<script> alert(" Error : Shelling R ' + wd + '../../data/R/bin/R");</script>'); 
						res.write('<script> window.location="http://jasan-maraiya.rhcloud.com/index;</script>');
						res.end();		
						});
				   workerProcess.on('close', function (code) {
						res.write('<script> alert(" Msg : R diconnected");</script><script> window.location="http://jasan-maraiya.rhcloud.com/index;</script>');
						res.end()
						});
				}
			else {
				res.writeHead(200,{'content-type' : 'text/html'});
				res.write('<script> alert("No Upload File received");</script>');
				//res.write('<script> alert("' + wd + '");</script>');		
				res.end();
			}
		});
		
		
		/*

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
	var RenameInRepo = function(fnameB , fnameA , callback ){ 
					var fileTransfer = child_process.exec( 'mv  '+wd+'uploads/UserData/'+fnameB.toString()+'   '+wd+'uploads/UserData/'+fnameA.toString() , function(err,stdout , stderr){ 
						if (err) { callback('Error in running child process');};
						if(stdout){ callback(wd+'uploads/UserData/'+fnameA.toString());};
						if(stderr){ callback('Error in Renaming');};
						});
					};

					
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
		res.writeHead(200, {'content-type':'text/html'});        
		res.redirect('/index');
	 res.end();
		});

//http.listen(port,function(){console.log("App Started")});


	
	
	
/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
    */ 
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./public/index.html');
    };
	


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
    
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asc'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/as'] = function(req, res) {
            var link = {'hi' : 'hello'};
            res.json(link);
        };
		
        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
    };
 */

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.napp = app;
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.napp.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

