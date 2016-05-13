define(function (require) {
	return function(method, model, options) {
		var methodMap = {
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
            }
		};	// methodMap

		var type = methodMap[method].type,
			success = methodMap[method].success,
			error = methodMap[method].error;

		var jqXHR  = $.ajax({ 
            url: model.url,
            
            type: type,
            
            dataType: "json",
            
            contentType: "application/json",

            data: model.toJSON(),              
        }).done(success).fail(error);

		return jqXHR;
	}	// return function()
});	// define