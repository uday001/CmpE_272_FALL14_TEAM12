exports.list = function(req, res){
	  req.getConnection(function(err,connection){
		  global_connection = connection;
		
	        var query = connection.query('SELECT * FROM books',function(err,rows)
	        {
	           if(err)
	                console.log("Error Selecting : %s ",err );
	           
	            
	            res.render('sbooks',{page_title:"Books Available",data:rows, userType:req.user['userType']});
	                
	           
	         });
	         
	         
	    });
	  
	};
	
	exports.getOrders = function(req,res){
	
		var bookId = req.params.id;
	    
	    req.getConnection(function (err, connection) {
	  
	        var query = connection.query("SELECT * FROM books where bookId=? ",bookId, function(err, rows)
	        		
	        {
	  
	          if (err)
	              console.log("Error Updating : %s ",err );
	         
	          res.render('sordered',{page_title:"Book Details",data:rows, userType:req.user['userType']});
	          
	        });

	    });
	};
	
	exports.reservebook = function(req,res){
	 
	    var userId = req.user['userid'];
	    var bookId = req.params.id;
	    var ordernum=Math.floor(Math.random()*800);
	    
	    req.getConnection(function (err, connection) {
	    	
	    	var moment = require('moment');
	    	var now = moment(new Date());
	    	var dateA = moment().add(7,'days').format('YYYY-MM-D');
	    	var quantity;
	    	
	        var data = {
	        	userId : userId,
	        	bookId    : bookId,
	        	orderId : ordernum,
	        	start_time	 : now.format("YYYY-MM-D"),
	        	end_time : dateA
	        
	        };
	        
	        var query1 = connection.query('SELECT quantity FROM books WHERE bookId = ? AND quantity>=1',bookId,function(err,rows)
	    	        {
	    	            
	    	            if(err)
	    	            {
	    	            	console.log("Error Selecting : %s ",err );
	    	            }
	    	            else{
	    	            	console.log("Quantity Available, proceeding to orders");
	    	            	console.log(rows[0].quantity);
	    	            	
	    	            		var query2 = connection.query("INSERT INTO myorder set ? ",data, function(err, rows1){
	  	    	            	  var flag = 0;
	  	    	      	          if(!err){
	  	    	      	        	flag = 1;
	  	    	      	        	console.log("Order Inserted, proceed to update");
	  	    	      	        	connection.query("UPDATE books set quantity=quantity-1 WHERE bookId = ? ",bookId, function(err, rows)
	  	    	      	      	        {
	  	    	      	      	            
	  	    	      	      	             if(err)
	  	    	      	      	                 console.log("Error updating : %s ",err );
	  	    	      	      	     });
	  	    	      	          }
	      	      	             var query3 = connection.query("SELECT * FROM myorder where userId="+req.user['userid'], function(err, orderRows)
 	    	      	      	        {
 	    	      	      	  
 	    	      	      	          if (err)
 	    	      	      	              console.log("Error selecting : %s ",err );
 	    	      	      	          console.log("orderRows ");
 	    	      	      	          console.log(orderRows);
 	    	      	      	    	    orderRows[0]['orderIsSuccess'] = flag;
 	    	      	      	           res.render('smybooks',{page_title:"Books Ordered",data:orderRows, userType:req.user['userType']});
		  	 	    	      	              	
		  	 	    	      	    });
	  	    	      	      	            
	  	    	      	          
	  	    	      	        });
	    	            	  
	    	           
	    	            }
	    	            	
	    	         });
	    
	        console.log(ordernum);
	        
	        
	    });
	};
	
	exports.cancelorder = function(req,res){
		
		
		req.getConnection(function(err,connection){
			  global_connection = connection;
			  
			  var query2 = connection.query("SELECT * FROM myorder WHERE userId ="+req.user['userid'],function(err,rows)
		    	        {
		    	            
		    	            if(err)
		    	            {
		    	            	console.log("Error Selecting : %s ",err );
		    	            }
		    	            res.render('sdeletOrder',{page_title:"Books Ordered",data:rows, userType:req.user['userType']});
		    	        });
       	      	          
	   });
	};
	
exports.cancelmyBook = function(req,res){
	var bookId = req.params.id;
		req.getConnection(function(err,connection){
			  global_connection = connection;
			  
			  connection.query("DELETE FROM myorder  WHERE userId ="+req.user['userid'], function(err, rows)
				  	     {
				  	    	      		            
				  	    	 if(err)
				  	    	    console.log("Error deleting : %s ",err );
				  	    	      		             
				  	    	 else
				  	    	    {
				  	    	      var query1 =  connection.query("UPDATE books set quantity=quantity+1 WHERE bookId = ? ",bookId, function(err, updaterows)
				  	    		  	 {
				  	    		  	   if(err)
				  	    		  	     console.log("Error deleting : %s ",err );
				  	    		  	    res.redirect('/sbooks');
				  	    		  	 });
				  	    		    	            
				  	    	    }
				  	     });
			  
		 });
};