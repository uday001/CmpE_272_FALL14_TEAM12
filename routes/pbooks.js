/*Save the query*/
exports.save = function(req,res){
    //console.log("control in exports.save ***");
    var input = JSON.parse(JSON.stringify(req.body));
    //var vuserid = "009874826";
    req.getConnection(function (err, connection) {
    	console.log(req.body);
    	var dateTime = new Date();
    	
    	
        var data = {
        	
            bookName    : input.bookName,
            description : input.bookDescription,
            bookId: input.bookId,
            quantity: input.numberOfBooks,
            author: input.author
            
            
        
        };
        
        var query = connection.query("INSERT INTO books set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         console.log("redirecting to queries from add");
          res.redirect('/pbooks');
          
        });
        //update();
        console.log(query.sql); //get raw query
    
    });
};

exports.add = function(req, res){
	  res.render('padd_book',{page_title:"Add Books", userType:req.user['userType']});
	};
	
exports.list = function(req, res){
	  req.getConnection(function(err,connection){
		  
	        var query = connection.query('SELECT * FROM books',function(err,rows)
	        {
	           if(err)
	                console.log("Error Selecting : %s ",err );
	           
	            
	            res.render('pbooks',{page_title:"Books Available",data:rows,userType:req.user['userType']});
	                
	           
	         });
	         
	         
	    });
	  
	};
	
	
		
		exports.getOrders = function(req,res){
			//var input = JSON.parse(JSON.stringify(req.body));
			var bookId = req.params.id;
		    
		    req.getConnection(function (err, connection) {
		    	
		        var query = connection.query("SELECT * FROM myorder where bookId=? ",bookId, function(err, rows)
		        		
		        {
		  
		          if (err)
		              console.log("Error Updating : %s ",err );
		         
		          res.render('porders',{page_title:"Books Ordered",data:rows,userType:req.user['userType']});
		          
		        });
		        //console.log(query.sql); //get raw query
		        
		    });
		};
		
		exports.delete_order = function(req,res){
	          
		     var bookId = req.params.id;
		     var userId = req.params.uid;
		    
		     req.getConnection(function (err, connection) {
		        
		        connection.query("DELETE FROM myorder  WHERE userId = ? ",userId, function(err, rows)
		        {
		            
		             if(err)
		                 console.log("Error deleting : %s ",err );
		          
		             
		        });
		        connection.query("UPDATE books set quantity=quantity+1 WHERE bookId = ? ",bookId, function(err, rows)
				        {
				            
				             if(err)
				                 console.log("Error deleting : %s ",err );
				             
				            
				             res.redirect('/pbooks');
				             
				        });
		     });
		};
		
		exports.delete_book = function(req,res){
	          
		     var bookId = req.params.id;
		    
		     req.getConnection(function (err, connection) {
		        
		        connection.query("DELETE FROM books  WHERE bookId = ? ",bookId, function(err, rows)
		        {
		            
		             if(err)
		                 console.log("Error deleting : %s ",err );
		          
		             
		        });
		        connection.query("DELETE FROM myorder  WHERE bookId = ? ",bookId, function(err, rows)
				        {
				            
				             if(err)
				                 console.log("Error deleting : %s ",err );
				             res.redirect('/pbooks');
				             
				        });
		       
		     });
		};
		
		exports.book_collected = function(req,res){
	          
		     var bookId = req.params.id;
		     var userId = req.params.uid;
		     //var coll="1";
		     req.getConnection(function (err, connection) {
		    	
		 		                var query = connection.query("Update myorder set collect=1 where userId=?",userId, function(err, rows)
		 		                {
		 		          
		 		                  if (err)
		 		                      console.log("Error inserting : %s ",err );
		 		                 console.log("update myorder done");
		 		               // res.render('orders',{page_title:"Books Ordered",data:rows});
		 		                  
		 		                });
		 		                
		 		               var query = connection.query("SELECT * FROM myorder where bookId=? ",bookId, function(err, rows)
		 				        		
		 		      		        {
		 		      		  
		 		      		          if (err)
		 		      		              console.log("Error Updating : %s ",err );
		 		      		         
		 		      		          res.render('porders',{page_title:"Books Ordered",data:rows,userType:req.user['userType']});
		 		      		          
		 		      		        });
		 		        	  
		 		         
		 		        	  
		 		          
		 		        
		       
		     });
		};