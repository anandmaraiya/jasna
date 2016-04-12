/* Main Application code 
Created by Anand Kr Maraiya 
*/


#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var app = express();
var fs      = require('fs');
var bodyParser = require('body-parser');
var output = 0;
var absorb = require('absorb');
//var fs = require('fs');
var wd = __dirname + '/public';
var datadir = process.env.OPENSHIFT_DATA_DIR;
var Rloc = datadir +'/R/bin';

var multer = require('multer');
var body1 = bodyParser.urlencoded( {extended : true});
var body2 = bodyParser.json();
var mustache = require('mustache'); // bring in mustache template engine

app.use(express.static(wd));
	//app.use());
var upload1 = multer({ dest : datadir+'/uploads/UserData'});
var upload2 = multer({ dest : datadir+'/uploads/UserRcode'});

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

 app.get("/*", function(req, res) {
		res.writeHead(200, {'content-type':'text/html'});        
		res.redirect('/index');
	 res.end();
		});


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

 app.get('/mypage' , function  (req,res){
	
	var rData = {records : demoData};
	 var page = fs.readFileSync(wd+'/mypage.html','utf8' );
	 console.log(page);
	 var html = mustache.to_html(page,rData);
	
	 res.send(html);
	 res.end();
	console.log('/mypage  loaded')	
 });
 
 
    var fnameA ='' ; var fnameB = '';
	var DefFile = 'default.csv' ; var DefRcode = 'default.R';
	var ftype = 'CSV';

app.post('/fileUpload', upload1.single('userfile'),function (req, res) {
	
	if(req.file){
	res.writeHead(200, {'content-type':'text/html'});

	fnameB = req.file.originalname;
	fnameA = req.file.filename;
	ftype = req.body.TypeData;
	
	res.write('<script>alert("File uploaded : '+fnameB+' of '+ftype + 'format")</script>');
	res.end();
	
    /*
	fs.rename( wd+'/uploads/UserData/'+fnameA ,wd+ '/uploads/UserData/'+fnameB, function (err) 
		{
		if (err) {res.end('<script>alert("Error while uploading file")</script>'}; 
		fs.createReadStream(wd+'/uploads/UserData/'+fnameB).pipe(fs.createWriteStream(wd+'/uploads/UserData/'+fnameB));
		res.write('<script>alert("Error while uploading file")</script>');
		var child_process = require('child_process');
		
		var fileTransfer = child_process.spawn( 'cp '+wd+ '/uploads/UserData/'+fnameB+' '+Rloc+'/'+fnameB,function (err) { 		res.write('<script>alert("Error while uploading file")</script>'); });;
		
		var workerProcess = child_process.exec( 'sh '+Rloc+'/R --vanilla  < '+wd+'/uploads/UserRcode/'		+	DefRcode);
		
		workerProcess.stdout.on('data', function (data,err) {
      if(err) console.log('error');
	  console.log('stdout: ' + data);
	  output = data;
	  res.write('<script>alert("Upload successful")</script>');
		res.write('<img src="'+Rloc+'/current.png"/> <br>');
		res.end();	
	  });
	  
   workerProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
	res.write('<script>alert("Error while running R")</script>');
	res.end('<script> window.location="http://jasan-maraiya.rhcloud.com/index;</script>');		
   });

   workerProcess.on('close', function (code) {
	  console.log('child process exited with code ' + code);
	  res.write('<script>alert("Upload successful")</script>');	  
		res.end('<script> window.location="http://jasan-maraiya.rhcloud.com/index;</script>');
			});
		});
	*/
	}
	
   else {
	res.writeHead(200, {'content-type':'text/html'});
   res.write('<script>alert("No datafile found for uploading")</script><script> window.location="http://jasan-maraiya.rhcloud.com/index";</script>');
	res.end();		
   }
   });




		
	
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

