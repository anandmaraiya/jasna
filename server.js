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
var Rloc = datadir+'/R/bin/';
	
//local variables
var body1 = bodyParser.urlencoded( {extended : true});
var body2 = bodyParser.json();
var storage1 = multer.diskStorage({
  destination: wd+UserId+'/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var limits = {fileSize : 1*1024};
var upload1 = multer({ storage : storage1 , limits : limits });


app.use(express.static(wd));
//Routes
// Create our Modal subclass


// Index
app.get('/index', function (req, res) {
res.sendFile(wd+"/index.html");   
 });
 
app.get('/api/R/:id', function(req,res){

				RProcess(req.query.code.code ,'', function (data){
					Alert(res , "R running");
					if(data == 'close'){ res.end(); return;}
					res.write(data);
					});
				//});


/*	var codetype = ''; var code = ''; 
	var id = req.params.id;	
	var query = req.query;
	if( id != 'ram'){ throw 'Error : "ID = '+id+'" is not present';}
	
	var sendJson  = {id : req.params.id};
	//sendJson['query'] = query;
	if(query.code == null){ throw 'Error : No infomation about code is available in the query';}
	console.log(wd);
	console.log(Rloc);
	switch(query.code.type){
	case 'STRING':  	console.log('selected STRING');
					code = 'input.R';
					codetype = query.code.type;
					fs.outputFile(Rloc+'input.R', query.code.code, function (err) {
						if (err) throw err;
						RProcess(code ,'', function (data){
					if(data == 'close'){ res.end(); return;}
					res.write(data);
					});
						fs.outputFile(wd+'/programs/'+'input.R',query.code.code);});
			break;  
  
	case 'FILE':  console.log('selected FILE');
					codetype = query.code.type;
				code = query.code.code;
				fs.copy(wd+id+'/programs/'+query.code.code, Rloc+query.code.code, 
					function (err) {
				console.log('selected FILE copied to '+Rloc);
				if (err) throw err; 
				RProcess(code ,'', function (data){
					if(data == 'close'){ res.end(); return;}
					res.write(data);
					});
				});
				break;
	default:  throw 'Error : No information about type of code . Please supply "STRING" or  "FILE"';
	}
	console.log(code);
*/
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
	var  RProcess = function(Rfile , file  , cb) { 
					var opts = {
					cwd: Rloc
							};
					var workerProcess = child_process.exec( 'sh R --vanilla  < '+ Rfile , opts );
//					var workerProcess = child_process.exec( 'Rscript.exe --vanilla  < '+ Rfile , opts );
					
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
			res.writeHead(200, {'content-type':'text/html'});
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
			res.writeHead(200, {'content-type':'text/html'});
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

