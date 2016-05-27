define(function (require) {
	return function(method, model, options) {
        if (method === 'update') {
            method = 'create';
        }

        var methodMap = {
			'read': {
                type: 'GET',

                success: function(userData) {                      
                    console.log("...SESSION ALIVE!");
                    console.log(userData);
                },

                error: function(xhr, error_msg, error) {
                    var error = new Error(error_msg);
                    error.code = xhr.status;

                    model.clearUser();
                    
                    console.log("...DEAD SESSION!\n" + error.code + " " + error.message);
                }
            },

            'create': {
				type: 'POST',
				
				success: function(userData) {                      
                    console.log("...SIGNIN SUCCESS!");
                    console.log(userData);

					model.getUserData(userData.id)
					 	.then(function(data) {
                    		model.setUser(data);
                    		model.trigger('login');
                		})
                		.catch(function(error) { 
                    		console.log(error);
                    		// TODO: trigger'LoadDataError'
                		});
                },

                error: function(xhr, error_msg, error) {
                    var error = new Error(error_msg);
                    error.code = xhr.status;
                    
                    model.trigger('loginError');

                    console.log("...SIGNIN ERROR!\n" + error.code + " " + error.message);
                }
            },

            'delete': {
                type: 'DELETE',

                success: function() { },

                error: function(xhr, error_msg, error) {
                    var error = new Error(error_msg);
                    error.code = xhr.status;

                    if (error.code === 200) { // No content
                        console.log("...SIGNOUT SUCCESS!");    
                        model.clearUser();
                        $(location).attr('href', '/');
                    } else {
                        console.log("...SIGNOUT ERROR!\n" + error.code + " " + error.message); 
                    }
                }
            }
		};	// methodMap

		var type = methodMap[method].type,
			success = methodMap[method].success,
			error = methodMap[method].error;

        var requestData = { 
            url: model.url,
              
            type: type,
            
            dataType: 'json',
          
            contentType: 'application/json',
 
            data: model.toJSON(),              
        }

        if (type === 'DELETE') {
            requestData.mimeType = 'text/html'  // "No element found" fix
        }

		var jqXHR  = $.ajax(requestData)
                        .done(success)
                        .fail(error);

		return jqXHR;
	}	// return function()
});	// define