/*var mysql=require('mysql');
var dataPool=require('../routes/ConnectionPooling');
 
var mysql = require('../db/mysql').pool;*/
 
 
 
exports.topic = function(req, res){
 var topic = req.params.topic;
// dataPool.getConnection(function(err,connection){
  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM topic',function(err,rows)
        {
           if(err)
                console.log("Error Selecting : %s ",err );
            //connection.pause();
            // Do some more processing on the row
            //rows[0].dateModified = "1";
            //console.log(rows[0].dateModified);
           
            //connection.resume();
           // console.log(query)
            if(rows.length!==0)
			{
			console.log("DATA : "+JSON.stringify(rows));
			//callback(err, rows);
			}
            res.render('ptopiclist',{page_title:"Your topics",data:rows, userType:req.user['userType']});
                
           
         });
         
         //console.log(query.sql);
    });
  
};
exports.addTopic = function(req, res){
  res.render('add_topic',{page_title:"Add Your Query", userType:req.user['userType']});
};
exports.saveTopic = function(req,res){
    //console.log("control in exports.save ***");
    var input = JSON.parse(JSON.stringify(req.body));
  
    var topic = req.params.topic;
    req.getConnection(function (err, connection) {
     console.log(req.body);
    
    
        var data = {
        
         topic : input.topic,
         //ID : input.ID,
           
        };
        // var query = connection.query1("")
        var query = connection.query("INSERT INTO topic set ? ",[data], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
        
          res.redirect('/ptopic/topic');
        });
        
        console.log(query.sql); //get raw query
    
    });
};
exports.viewrate = function(req, res){
  req.getConnection(function(err,connection){
  var topic = req.params.topic;
      
        var query = connection.query('SELECT * FROM rate where topic= ?',[topic],function(err,rows)
        {
           if(err)
                console.log("Error Selecting : %s ",err );
            //connection.pause();
            // Do some more processing on the row
            //rows[0].dateModified = "1";
            //console.log(rows[0].dateModified);
            connection.resume();
            
            res.render('prate',{page_title:"Your Ratings",data:rows, topic:topic, userType:req.user['userType']});
                
           
         });
         
         //console.log(query.sql);
    });
  
};