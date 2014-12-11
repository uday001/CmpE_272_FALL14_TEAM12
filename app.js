var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');


//surbhi


var ptopic = require('./routes/ptopic'); 
var stopic = require('./routes/stopic');


//surbhi

//neethi
var pbooks = require('./routes/pbooks'); 
var sbooks = require('./routes/sbooks'); 
//neethi


//load queries route
var queries = require('./routes/queries'); 
var app = express();
var mysql = require('mysql');
var connection1  = require('express-myconnection');

//new edit

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var user = require('./routes/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);



app.use(
    connection1(mysql,{
    	host: 'us-cdbr-iron-east-01.cleardb.net',
    	  user: 'bd69a411c46b46',
    	  password: '3664398a',
    	  database: 'ad_555f3ebb1eb886a',
    	  port: 3306
    },'pool') //or single
);

app.use(app.router);


var sess;
var connectionsArray = [],
connection = mysql.createConnection({
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'bd69a411c46b46',
  password: '3664398a',
  database: 'ad_555f3ebb1eb886a',
  port: 3306
}),
POLLING_INTERVAL = 3000,
pollingTimer;


var isSAuthenticated = function(req, res, next){
	
	
	if(req.isAuthenticated()){
		//console.log(req.user['userType']);
		if(req.user['userType']=="student"){
			return next();
		}
	}else {
		res.redirect('/auth');
	}
};

var isPAuthenticated = function(req, res, next){
	
	if(req.isAuthenticated()){
		if(req.user['userType']=="professor"){
			return next();
		}
		
	}else {
		res.redirect('/auth');
	}
};

var isAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else {
		res.redirect('/auth');
	}
};

//app.get('/', routes.index);
app.get('/queries', isSAuthenticated, queries.list);
app.get('/queries/add', isSAuthenticated, queries.add);
app.post('/queries/add', isSAuthenticated, queries.save);
app.get('/queries/delete/:id', isSAuthenticated, queries.delete_query);
app.get('/queries/edit/:id', isSAuthenticated, queries.edit);
app.get('/queries/view_answer/:id', isSAuthenticated, queries.view_answer);
app.get('/queries/vote_up/:id', isSAuthenticated, queries.vote_up);
app.get('/queries/vote_down/:id', isSAuthenticated, queries.vote_down);
app.post('/queries/save_edit/:id', isSAuthenticated, queries.save_edit);

app.get('/pqueries', isPAuthenticated, queries.plist);
app.get('/pqueries/pview_answer/:id', isPAuthenticated, queries.view_answer);


app.get('/report/:id', isAuthenticated, queries.report);
app.get('/unreport/:id', isAuthenticated, queries.unreport);
//surbhi

app.get('/ptopic/topic',isPAuthenticated, ptopic.topic);
app.get('/ptopic/add_topic',isPAuthenticated, ptopic.addTopic);
app.post('/ptopic/savetopic',isPAuthenticated, ptopic.saveTopic);
app.get('/ptopic/viewrate/:topic',isPAuthenticated, ptopic.viewrate);

app.get('/stopic/topic',isSAuthenticated, stopic.topic);
app.get('/stopic/viewrate/:topic',isSAuthenticated, stopic.viewrate);
app.get('/stopic/vote_up/:id',isSAuthenticated, stopic.vote_up);
app.get('/stopic/vote_down/:id',isSAuthenticated, stopic.vote_down);
app.get('/stopic/add/:topic',isSAuthenticated, stopic.addrate);
app.post('/stopic/save/:topic',isSAuthenticated, stopic.saverate);
app.get('/stopic/edit/:topic/:id',isSAuthenticated, stopic.editrate);
app.post('/stopic/saveedit/:topic/:id',isSAuthenticated, stopic.saveEdit);

//surbhi

//neethi
app.get('/pbooks/add', isPAuthenticated, pbooks.add);
app.post('/pbooks/save', isPAuthenticated, pbooks.save); 
app.get('/pbooks', isPAuthenticated, pbooks.list);
app.get('/pbooks/orders/:id',isPAuthenticated, pbooks.getOrders);
app.get('/pbooks/orders/:id/:uid/delete', isPAuthenticated, pbooks.delete_order);
app.get('/pbooks/orders/:id/delbook', isPAuthenticated, pbooks.delete_book);
//app.get('/pbooks/orders/:id/:uid/collected', pbooks.book_collected);


app.get('/sbooks', isSAuthenticated, sbooks.list);
app.get('/sbooks/order/:id',isSAuthenticated, sbooks.getOrders);
app.get('/sbooks/order/:id/reserve',isSAuthenticated, sbooks.reservebook);
app.get('/sbooks/order/:id/cancel',isSAuthenticated, sbooks.cancelorder);
app.get('/sbooks/deleteOrder', isSAuthenticated, sbooks.cancelorder);
app.get('/sbooks/order/:id/deleteBook', isSAuthenticated, sbooks.cancelmyBook);



app.get('/demo', isAuthenticated, queries.getDemo);
app.get('/demo1', isAuthenticated, queries.getDemo2);
//neethi
//edit1

passport.serializeUser(function(user, done) {
  //console.log("user2 "+user.userid);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
	//console.log("user2 "+user.userid);
	//console.log("user2 "+user.password);
	//console.log("user2 "+user.userType);
  done(null, user);
});


passport.use(new LocalStrategy(function(username, password, done){
    //console.log("You entered "+username+" "+password);
    process.nextTick(function () {
      query = connection.query('SELECT userid, password, userType FROM users where userid='+username);
      var user;
      query
      .on('result', function( user1 ) {
          // it fills our array looping on each user row inside the db
      	user = user1;
      })
      .on('end', function(err) {
    	  	if (err) { console.log("error1"); return done(err);  }
  			if (!user) { console.log("error2"); return done(null, false); }
  			if (user.password != password) { console.log("error3"); return done(null, false); }
  			console.log("validation_success");
  			//console.log(user);
  			return done(null, user);
  		});
    });
    }
));



app.get('/', function(req, res, next) {
  res.sendfile('views/login.html');
	//res.redirect('/demo');
});


app.get('/loginFailure' , function(req, res, next){
	res.send('Failure to authenticate');
});

app.get('/loginSuccess' , function(req, res, next){
	res.send('Successfully authenticated');
});

app.post('/demo',
  passport.authenticate('local', {
    successRedirect: '/demo',
    failureRedirect: '/loginFailure'
  }));

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

//edit2



var server = http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});


var io = require('socket.io').listen(server);


var pollingLoop = function () {
    //console.log(new Date());
    // Make the database query
    var query = connection.query('SELECT dateModified FROM queries'),
        users = []; // this array will contain the result of our db query
    

    // set up the query listeners
    query
    .on('error', function(err) {
        // Handle error, and 'end' event will be emitted after this as well
        console.log( err );
        updateSockets( err );
        
    })
    .on('result', function( user ) {
        // it fills our array looping on each user row inside the db
    	users.push( user );
    	
    })
    .on('end',function(){
        // loop on itself only if there are sockets still connected
        if(connectionsArray.length) {
            pollingTimer = setTimeout( pollingLoop, POLLING_INTERVAL );
            actual_users = [];
        	for(i=0; i<users.length; i++){
        		//console.log(users[i].dateModified);
        		var date  = new Date();
            	var difference =  0;
            	if((date - users[i].dateModified) < POLLING_INTERVAL){
            		//console.log(difference + " __ " + date + " __ " + users[i].dateModified);
            		actual_users.push(users[i]);
            	}
        	}
            if(actual_users.length != 0){
	            updateSockets({actual_users:actual_users});
	            //console.log("####");
        	}
        }
    });
};

// create a new websocket connection to keep the content updated without any AJAX request
io.sockets.on( 'connection', function ( socket ) {
    
    //console.log('Number of connections:' + connectionsArray.length);
    // start the polling loop only if at least there is one user connected
    if (!connectionsArray.length) {
        pollingLoop();
    }
    
    socket.on('disconnect', function () {
        var socketIndex = connectionsArray.indexOf( socket );
        //console.log('socket = ' + socketIndex + ' disconnected');
        if (socketIndex >= 0) {
            connectionsArray.splice( socketIndex, 1 );
        }
    });

    //console.log( 'A new socket is connected!' );
    connectionsArray.push( socket );
    
});




var updateSockets = function ( data ) {
    // store the time of the latest update
    //data.time = new Date();
    // send new data to all the sockets connected
    connectionsArray.forEach(function( tmpSocket ){
        tmpSocket.volatile.emit( 'notification' , data );
        //console.log("data emitted");
    });
};


app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});