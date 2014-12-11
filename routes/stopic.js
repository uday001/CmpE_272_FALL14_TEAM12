/**
 * New node file
 */
/**
 * New node file
 */
exports.topic = function(req, res){
	 var topic = req.params.topic;
	  req.getConnection(function(err,connection){
	       
	        var query = connection.query('SELECT * FROM topic',function(err,rows)
	        {
	           if(err)
	                console.log("Error Selecting : %s ",err );
	           	//connection.pause();
	           	// Do some more processing on the row
	           	//rows[0].dateModified = "1";
	           	//console.log(rows[0].dateModified);
	           
	           	connection.resume();
	           // console.log(query)
	           	if(rows.length!==0)
				{
					console.log("DATA : "+JSON.stringify(rows));
					//callback(err, rows);
				}
	            res.render('stopiclist',{page_title:"Your topics",data:rows,userType:req.user['userType']});
	                
	           
	         });
	         
	         //console.log(query.sql);
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
		            
		            res.render('srate',{page_title:"Your rates",data:rows, topic:topic, userid:req.user['userid'], userType:req.user['userType']});
		                
		           
		         });
		         
		         //console.log(query.sql);
		    });
		  
		};
		
		
		exports.vote_up = function(req,res){
			var input = JSON.parse(JSON.stringify(req.body));
			var id = req.params.id;
		    var userid = req.user['userid'];
		    var topic=req.param.topic;
			
			
		    req.getConnection(function (err, connection) {
		    	
		    	var upVotes="";
		    	var downVotes="";
		    	var totalUpVotes = 0;
		    	var totalDownVotes = 0;
		    	var oneminus_totalDownVotes = 0;
		    	var oneminus_downVotes;
		    	var query = connection.query('SELECT topic,upVotes, downVotes FROM rate WHERE id = ?',[id],function(err,rows)
		    	        {
		    	            
		    	            if(err)
		    	            	{
		    	                console.log("Error Selecting : %s ",err );
		    	        }
		    	            
		    	            console.log("upVotes from rows"+rows[0].upVotes);
		    	            console.log("downVotes from rows"+rows[0].downVotes);
		    	            upVotes = rows[0].upVotes;
		    	            downVotes = rows[0].downVotes;
		    	            totalUpVotes = rows[0].totalUpVotes;
		    	            totalDownVotes = rows[0].totalDownVotes;
		    	            topic=rows[0].topic;
		    	         });
		    	
		    console.log("upvotes"+upVotes);
		    console.log("downVotes"+downVotes);
		    
		    // remove if present, the student's vote from downVotes because he is now voting up the question.
		    if(downVotes.search(userid) !=  -1){
		    	oneminus_downVotes = downVotes.replace(", "+userid, "");
		    	if(totalDownVotes > 0)
		    		oneminus_totalDownVotes = totalDownVotes-1;
		    }
		    else{
		    	oneminus_downVotes = downVotes;
		    	oneminus_totalDownVotes = totalDownVotes;
		    }
		    
		    if(upVotes.search(userid) ==  -1){
		    	var oneplus_upVotes = upVotes + ", " + userid;
		    	var oneplus_totalUpVotes = totalUpVotes + 1;
		    	console.log("again");
		    	console.log("upvotes"+oneplus_upVotes);
		    	console.log("downvotes"+downVotes);
		    	
		    	var data = {
		                upVotes    : oneplus_upVotes,
		                downVotes : oneminus_downVotes,
		                totalUpVotes : oneplus_totalUpVotes,
		                totalDownVotes : oneminus_totalDownVotes
		        };
		    	
		    	var query = connection.query("UPDATE rate set ? WHERE id = ? ",[data,id], function(err, rows)
		    	        {
		    	  
		    	          if (err)
		    	              console.log("Error Updating : %s ",err );
		    	         
		    	          res.redirect('/stopic/viewrate/'+topic);
		    	          
		    	        });
		    	}
		        
		        //console.log(query.sql); //get raw query
		    });
		};

		
		exports.vote_down = function(req,res){
			var input = JSON.parse(JSON.stringify(req.body));
			var id = req.params.id;
		    var userid = req.user['userid'];
		    var topic=req.param.topic;
			
			
		    req.getConnection(function (err, connection) {
		    	
		    	var upVotes="";
		    	var downVotes="";
		    	var totalUpVotes = 0;
		    	var totalDownVotes = 0;
		    	var oneminus_totalUpVotes = 0;
		    	var oneminus_upVotes;
		    	var query1 = connection.query('SELECT topic,upVotes, downVotes FROM rate WHERE id = ?',[id],function(err,rows)
		    	        {
		    	            
		    	            if(err){
		    	            	console.log("Error Selecting : %s ",err );
		    	            }
		    	           downVotes = rows[0].downVotes;
		    	            upVotes = rows[0].upVotes;
		    	            totalUpVotes = rows[0].totalUpVotes;
		    	            totalDownVotes = rows[0].totalDownVotes;
		    	            topic=rows[0].topic;
		    				
		    	           
		    	         });
		    	console.log(downVotes);
		    // remove if present, the student's vote from upVotes because he is now voting down the question.
		    if(upVotes.search(userid) !=  -1){
		    	oneminus_upVotes = upVotes.replace(", "+userid, "");
		    	if(totalUpVotes > 0)
		    		oneminus_totalUpVotes = totalUpVotes-1;
		    }
		    else{
		    	oneminus_upVotes = upVotes;
		    	oneminus_totalUpVotes = totalUpVotes; 
		    }
		    
		    if(downVotes.search(userid) ==  -1){
		    	var oneplus_downVotes = downVotes + ", " + userid;
		    	var oneplus_totalDownVotes = totalDownVotes+1;
		    	var data = {
		            	upVotes : oneminus_upVotes,
		                downvotes    : oneplus_downVotes,
		                totalUpVotes : oneminus_totalUpVotes,
		                totalDownVotes : oneplus_totalDownVotes,
		        };
		    	
		    	var query = connection.query("UPDATE rate set ? WHERE id = ? ",[data,id], function(err, rows)
		    	        {
		    	  
		    	          if (err)
		    	              console.log("Error Updating : %s ",err );
		    	         
		    	          res.redirect('/stopic/viewrate/'+topic);
		    	          
		    	        });
		    	}
		        
		        //console.log(query.sql); //get raw query
		    });
		};
		
		
		exports.addrate = function(req,res){
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
		        var query = connection.query('SELECT * FROM rate where topic= ?',[topic],function(err,rows)
		        {
		  
		          if (err)
		              console.log("Error inserting : %s ",err );
		         
		        //  res.redirect('/queries/topic');
		          res.render('addrate',{page_title:"Your topics",topic:topic,userType:req.user['userType']});
		        });
		        
		        console.log(query.sql); //get raw query
		    
		    });
		};
		exports.saverate = function(req,res){
		    //console.log("control in exports.save ***");
		    var input = JSON.parse(JSON.stringify(req.body));
		    var vuserid = req.user['userid'];
		   // var vtopic="security"
		    var topic = req.params.topic;
		    req.getConnection(function (err, connection) {
		    	console.log(req.body);
		    	var totalUpVotes1=0;
		    	
		    	var totalDownVotes1=0;
		    	var dateTime = new Date();
		    	var anonymousValue = 0;
		    	if(req.body.anonymous != null){
		    		anonymousValue = 1;
		    	}
		    	console.log(input.rate);
		    	console.log(input.review);
		        var data = {
		        	userid : vuserid,
		        	topic : topic,
		        	rate    : input.rate,
		            review : input.review,
		            dateModified	 : dateTime,
		            anonymous : anonymousValue,
		            upVotes : "",
		            downVotes : "",
		            totalUpVotes: totalUpVotes1,
		            totalDownVotes: totalDownVotes1
		        };
		        // var query = connection.query1("")
		        var query = connection.query("INSERT INTO rate set ?  ",[data], function(err, rows)
		        {
		  
		          if (err)
		              console.log("Error inserting : %s ",err );
		         
		        //  res.redirect('/queries/topic');
		          res.redirect('/stopic/viewrate/'+topic);
		        });
		        
		        console.log(query.sql); //get raw query
		    
		    });
		};
		
		
		
		
		exports.editrate = function(req, res){
		    
		    var id = req.params.id;
		    var topic = req.params.topic;
		    var rate = req.params.rate;
		    var review = req.params.review ;
		    
		    req.getConnection(function(err,connection){
		       
		        var query = connection.query('SELECT * FROM rate WHERE topic = ? and id = ?',[topic,id],function(err,rows)
		        {
		            
		            if(err)
		                console.log("Error Selecting : %s ",err );
		     
		            res.render('edit_rate',{page_title:"Edit Your Query",data:rows,userType:req.user['userType']});
		                
		           
		         });
		         
		         //console.log(query.sql);
		    }); 
		};
		
		
		exports.saveEdit = function(req,res){
			var input = JSON.parse(JSON.stringify(req.body));
			var id = req.params.id;
			 var topic = req.params.topic;
		    
		    req.getConnection(function (err, connection)
		    		{
		    	console.log(req.body);
		    	var dateTime = new Date();
		    	console.log(dateTime);
		    	var anonymousValue = 0;
		    	if(req.body.anonymous != null){
		    		anonymousValue = 1;
		    	}
		    	
		        var data = {
		        		
		        	rate:input.rate,
		        	review:input.review,
		            topic    : input.topic,
		            dateModified	 : dateTime,
		            anonymous : anonymousValue
		        
		        };
		        
		        var query = connection.query("UPDATE rate set ? WHERE id = ? ",[data,id], function(err, rows)
		        {
		  
		          if (err)
		        	 {
		              console.log("Error Updating : %s ",err );
		        }
		          res.redirect('/stopic/viewrate/'+ topic);
		          
		        });
		        //console.log(query.sql); //get raw query
		        
		    });
		};