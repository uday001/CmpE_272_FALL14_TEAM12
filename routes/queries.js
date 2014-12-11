
/*
 * GET users listing.
 */
var numOfRecords = 0;
var global_connection;
var update = function(){
	console.log("update called");
	
		  var query = global_connection.query('SELECT COUNT(*) AS numOfRecords FROM table_name',function(err,rows)
			        {
			           if(err)
			                console.log("Error Selecting : %s ",err );
			           	
			            
			            
			           numOfRecords = rows[0].numOfRecords;
			           
			         });
	
	
};

exports.plist = function(req, res){
	console.log("Currently in queries.list "+req.user);
  req.getConnection(function(err,connection){
	  global_connection = connection;
	  
        var query = connection.query('SELECT * FROM queries ORDER BY id DESC',function(err,rows)
        {
           if(err)
                console.log("Error Selecting : %s ",err );
           	//connection.pause();
           	// Do some more processing on the row
           	//rows[0].dateModified = "1";
           	//console.log(rows[0].dateModified);
           	//connection.resume();
           
            
            res.render('pqueries',{page_title:"Your Queries",data:rows, userid:req.user['userid'], userType:req.user['userType']});
            
         });
         
    });
  
};

exports.list = function(req, res){
	console.log("Currently in queries.list "+req.user);
  req.getConnection(function(err,connection){
	  global_connection = connection;
	  
        var query = connection.query('SELECT * FROM queries ORDER BY id DESC',function(err,rows)
        {
           if(err)
                console.log("Error Selecting : %s ",err );
           	//connection.pause();
           	// Do some more processing on the row
           	//rows[0].dateModified = "1";
           	//console.log(rows[0].dateModified);
           	//connection.resume();
           res.render('queries',{page_title:"Your Queries",data:rows, userid:req.user['userid'], userType:req.user['userType']});
                
           
         });
         
         //console.log(query.sql);
    });
  
};

exports.add = function(req, res){
  res.render('add_query',{page_title:"Add Your Query" , userType:req.user['userType']});
};

exports.getDemo = function(req, res){
	  res.render('demo',{page_title:"Canvas Plus", userType:req.user['userType']});
	};
	
	exports.getDemo2 = function(req, res){
		  res.render('demo1',{page_title:"Canvas Plus", userType:req.user['userType']});
		};

exports.view_answer = function(req, res){
    
    var id = req.params.id;
    console.log("id"+id);
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM queries WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            //rows[0].dateModified = 1;
            console.log("rows12"+rows);
            var report = false;
            if(rows[0].abuseVotes != null){
            	if(rows[0].abuseVotes.search(req.user['userid']) != -1)
            		report = true;
            }
            if(req.user['userType']=="student"){
            	res.render('view_answer',{page_title:"View Answer",data:rows, report:report , userType:req.user['userType']});
            }else{
            	res.render('pview_answer',{page_title:"View Answer",data:rows, report:report, userType:req.user['userType']});
            }
         });
         //console.log(query.sql);
    }); 
};


exports.edit = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM queries WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_query',{page_title:"Edit Your Query",data:rows, userType:req.user['userType']});
                
           
         });
    }); 
};

/*Save the query*/
exports.save = function(req,res){
    console.log("control in exports.save ***");
    var input = JSON.parse(JSON.stringify(req.body));
    var vuserid = req.user['userid'];
    console.log(vuserid);
    req.getConnection(function (err, connection) {
    	console.log(req.body);
    	var dateTime = new Date();
    	var anonymousValue = 0;
    	if(req.body.anonymous != null){
    		anonymousValue = 1;
    	}
    	
        var data = {
        	userid : vuserid,
            query    : input.query,
            dateModified : dateTime,
            anonymous : anonymousValue,
            upVotes : "",
            downVotes : "",
            totalUpVotes : 0,
            totalDownVotes : 0
        
        };
        
        var query = connection.query("INSERT INTO queries set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         console.log("redirecting to queries from add");
          res.redirect('/queries');
          
        });
        //update();
        console.log(query.sql); //get raw query
    
    });
};

exports.save_edit = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
    
    req.getConnection(function (err, connection) {
    	console.log(req.body);
    	var dateTime = new Date();
    	console.log(dateTime);
    	var anonymousValue = 0;
    	if(req.body.anonymous != null){
    		anonymousValue = 1;
    	}
    	
        var data = {
        	
            answer    : input.answer,
            dateModified	 : dateTime,
            anonymous : anonymousValue
        
        };
        
        var query = connection.query("UPDATE queries set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/queries');
          
        });
        //console.log(query.sql); //get raw query
        
    });
};


exports.report = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
    var userid = req.user['userid'];
	console.log("report"+userid);
	
    req.getConnection(function (err, connection) {
    	var abuseVotes="";
    	var totalAbuseVotes = 0;
    	var query = connection.query('SELECT abuseVotes, totalAbuseVotes FROM queries WHERE id = ?',[id],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            console.log(rows[0].abuseVotes);
            abuseVotes = " "+rows[0].abuseVotes;
            totalAbuseVotes = rows[0].totalAbuseVotes;
            
            console.log("abuseVotes "+abuseVotes);
            if(abuseVotes != null){
            if(abuseVotes.search(userid) ==  -1){
            	var oneplus_abuseVotes = abuseVotes + ", " + userid;
            	var oneplus_totalAbuseVotes = totalAbuseVotes + 1;
            	var professorReported = 0;
            	var data;
            	if(req.user['userType'] == "professor"){
            		professorReported = 1;
            		data = {
                			abuseVotes    : oneplus_abuseVotes,
                            totalAbuseVotes : oneplus_totalAbuseVotes,
                            professorReported :  professorReported
                    };
            	}else{
            		data = {
                			abuseVotes    : oneplus_abuseVotes,
                            totalAbuseVotes : oneplus_totalAbuseVotes,
                    };
            	}
            	
            	
            	var query = connection.query("UPDATE queries set ? WHERE id = ? ",[data,id], function(err, rows)
            	        {
            			  if (err)
            	              console.log("Error Updating : %s ",err );
            			  else{
            				  console.log(abuseVotes+" updated");
            				  var query2 = connection.query('SELECT professorReported, totalAbuseVotes FROM queries WHERE id = ?',[id],function(err,rows)
            					        {
            					            if(err)
            					                console.log("Error Selecting : %s ",err );
            					            var totalAbuseVotes = rows[0].totalAbuseVotes;
            					            var professorReported = rows[0].professorReported;
            					            var query3 = connection.query('SELECT COUNT(id) as totalCount FROM queries WHERE id = ?',[id],function(err,rows)
        		    					        {
        		    					            if(err)
        		    					                console.log("Error Selecting : %s ",err );
        		    					            var forceDisplay = 0;
        		    					            var data2;
        		    					            if(rows[0].totalCount/2 <= totalAbuseVotes && professorReported == 1){
        		    					            	data2 = {
        		    					            			forceDisplay : 1
        		    					            	}
        		    					            }
        		    					            else{
        		    					            	data2 = {
        		    					            			forceDisplay : 0
        		    					            	}
        		    					            }
        		    					            	var query4 = connection.query("UPDATE queries set ? WHERE id = ?",[data2,id], function(err,rows)
        	    					            	        {
        	    					            	            if(err)
        	    					            	                console.log("Error Selecting : %s ",err );
        	    					            	            
        	    					            	         });
        		    					         });
            					         });
            			  }
            			  console.log("report"+req.user['userType']);
            			  if(req.user['userType']=="professor")
            				  res.redirect('/pqueries/pview_answer/'+id);
            			  else
            				  res.redirect('/queries/view_answer/'+id);
            	          
            	        });
            	}
        }
            if(req.user['userType']=="professor")
  			  res.redirect('/pqueries/pview_answer/'+id);
  		  else
  			  res.redirect('/queries/view_answer/'+id);
        });
    
        
        //console.log(query.sql); //get raw query
    });
};

exports.unreport = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
    var userid = req.user['userid'];
    var professorReported = 0;
	
    req.getConnection(function (err, connection){
    	
    	var abuseVotes="";
    	var totalAbuseVotes = 0;
    	var query = connection.query('SELECT abuseVotes, totalAbuseVotes FROM queries WHERE id = ?',[id],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            abuseVotes = rows[0].abuseVotes;
            totalAbuseVotes = rows[0].totalAbuseVotes;
            if(abuseVotes != null){
            if(abuseVotes.search(userid) !=  -1){
            	var oneminus_abuseVotes = abuseVotes.replace(userid+", ", "");
            	var oneminus_totalAbuseVotes = totalAbuseVotes - 1;
            	var data;
            	if(req.user['userType'] == "professor"){
            		professorReported = 0;
            		data = {
                			abuseVotes    : oneminus_abuseVotes,
                            totalAbuseVotes : oneminus_totalAbuseVotes,
                            professorReported : professorReported
                    };
            	}else{
            		data = {
        	    			abuseVotes    : oneminus_abuseVotes,
        	                totalAbuseVotes : oneminus_totalAbuseVotes,
            	        };
            	}
            	
            	
            	var query = connection.query("UPDATE queries set ? WHERE id = ?",[data,id], function(err, rows)
        	        {
        			  if (err)
        	              console.log("Error Updating : %s ",err );
        			  else{
        				  var query2 = connection.query('SELECT professorReported, totalAbuseVotes FROM queries WHERE id = ?',[id],function(err,rows)
        					        {
        					            if(err)
        					                console.log("Error Selecting : %s ",err );
        					            var totalAbuseVotes = rows[0].totalAbuseVotes;
        					            var professorReported = rows[0].professorReported;
        					            var query3 = connection.query('SELECT COUNT(id) as totalCount FROM queries WHERE id = ?',[id],function(err,rows)
        	    					        {
        	    					            if(err)
        	    					                console.log("Error Selecting : %s ",err );
        	    					            var forceDisplay = 0;
        	    					            var data2;
        	    					            console.log(rows[0].totalCount);
        	    					            if(rows[0].totalCount/2 <= totalAbuseVotes && professorReported == 1){
        	    					            	data2 = {
        	    					            			forceDisplay : 1
        	    					            	}
        	    					            }
        	    					            else{
        	    					            	data2 = {
        	    					            			forceDisplay : 0
        	    					            	}
        	    					            }
            					            	var query4 = connection.query("UPDATE queries set ? WHERE id = ?",[data2,id], function(err,rows)
        					            	        {
        					            	            if(err)
        					            	                console.log("Error Selecting : %s ",err );
        					            	        });
        	    					         });
        					         });
        			  }
        			  console.log("unreport"+req.user['userType']);
        			  if(req.user['userType']=="professor")
        				  res.redirect('/pqueries/pview_answer/'+id);
        			  else
        				  res.redirect('/queries/view_answer/'+id);
        	        });
            	}
        }if(req.user['userType']=="professor")
			  res.redirect('/pqueries/pview_answer/:'+id);
		  else
			  res.redirect('/queries/view_answer/:'+id);
         });
    	
    
        
        //console.log(query.sql); //get raw query
    });
};


exports.vote_up = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
    var userid = req.user['userid'];
	
	
    req.getConnection(function (err, connection) {
    	
    	var upVotes="";
    	var downVotes="";
    	var totalUpVotes = 0;
    	var totalDownVotes = 0;
    	var oneminus_totalDownVotes = 0;
    	var oneminus_downVotes;
    	var query = connection.query('SELECT upVotes, downVotes, totalUpVotes, totalDownVotes FROM queries WHERE id = ?',[id],function(err,rows)
    	        {
    	            
    	            if(err)
    	                console.log("Error Selecting : %s ",err );
    	            console.log("upVotes from rows"+rows[0].upVotes);
    	            console.log("downVotes from rows"+rows[0].downVotes);
    	            upVotes = rows[0].upVotes;
    	            downVotes = rows[0].downVotes;
    	            totalUpVotes = rows[0].totalUpVotes;
    	            totalDownVotes = rows[0].totalDownVotes;
    	            
    	            console.log("upvotes"+upVotes);
    	            console.log("downVotes"+downVotes);
    	            
    	            // remove if present, the student's vote from downVotes because he is now voting up the question.
    	            if(downVotes.search(userid) !=  -1){
    	            	console.log("dbefore"+downVotes);
    	            	oneminus_downVotes = downVotes.replace(", "+userid, "");
    	            	console.log("dafter"+oneminus_downVotes);
    	            	if(totalDownVotes > 0)
    	            		oneminus_totalDownVotes = totalDownVotes-1;
    	            }
    	            else{
    	            	oneminus_downVotes = downVotes;
    	            	oneminus_totalDownVotes = totalDownVotes;
    	            }
    	            
    	            if(upVotes.search(userid) ==  -1){
    	            	console.log("ubefore"+upVotes);
    	            	var oneplus_upVotes = upVotes + ", " + userid;
    	            	console.log("uafter"+oneplus_upVotes);
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
    	            	
    	            	var query = connection.query("UPDATE queries set ? WHERE id = ? ",[data,id], function(err, rows)
    	            	        {
    	            	  
    	            	          if (err)
    	            	              console.log("Error Updating : %s ",err );
    	            	         
    	            	          
    	            	          
    	            	        });
    	            	}res.redirect('/queries');
    	         });
    	
    
        
        //console.log(query.sql); //get raw query
    });
};

exports.vote_down = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
    var userid = req.user['userid'];
	
	
    req.getConnection(function (err, connection) {
    	
    	var upVotes="";
    	var downVotes="";
    	var totalUpVotes = 0;
    	var totalDownVotes = 0;
    	var oneminus_totalUpVotes = 0;
    	var oneminus_upVotes;
    	var query1 = connection.query('SELECT upVotes, downVotes, totalUpVotes, totalDownVotes FROM queries WHERE id = ?',[id],function(err,rows)
    	        {
    	            
    	            if(err)
    	                console.log("Error Selecting : %s ",err );
    	            else{
    	            downVotes = rows[0].downVotes;
    	            upVotes = rows[0].upVotes;
    	            totalUpVotes = rows[0].totalUpVotes;
    	            totalDownVotes = rows[0].totalDownVotes;
    	            console.log(upVotes.search(userid));
    	            if(upVotes.search(userid) !=  -1){
    	            	oneminus_upVotes = upVotes.replace(", "+userid, "");
    	            	if(totalUpVotes > 0)
    	            		oneminus_totalUpVotes = totalUpVotes-1;
    	            	console.log(upVotes);
    	            }
    	            else{
    	            	oneminus_upVotes = upVotes;
    	            	oneminus_totalUpVotes = totalUpVotes; 
    	            }
    	            console.log("downvsearch"+downVotes.search(userid));
    	            if(downVotes.search(userid) ==  -1){
    	            	var oneplus_downVotes = downVotes + ", " + userid;
    	            	var oneplus_totalDownVotes = totalDownVotes+1;
    	            	var data = {
    	                    	upVotes : oneminus_upVotes,
    	                        downvotes    : oneplus_downVotes,
    	                        totalUpVotes : oneminus_totalUpVotes,
    	                        totalDownVotes : oneplus_totalDownVotes
    	                };
    	            	console.log(data);
    	            	var query2 = connection.query("UPDATE queries set ? WHERE id = ? ",[data,id], function(err, rows)
    	            	        {
    	            	  
    	            	          if (err)
    	            	              console.log("Error Updating : %s ",err );
    	            	         
    	            	          
    	            	          
    	            	        });
    	            	}
    	            	res.redirect('/queries');
    	        	}
    	         });
    	
    console.log(downVotes);
    
    
 // remove if present, the student's vote from upVotes because he is now voting down the question.
    
        
        //console.log(query.sql); //get raw query
    });
};

exports.delete_query = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM queries  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/queries');
             
        });
        
     });
};


