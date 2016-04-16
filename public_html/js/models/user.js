define([
	'backbone',
	'./player'
], function(
	Backbone,
	PlayerModel
) {    
    var UserModel = Backbone.Model.extend({
    	defaults: {
    		id: 0,
    		login: '',
    		email: '',
    		password: '',
    		avatar: '',
    		player: new PlayerModel()
    	},

    	asPlayer: function() {
    		return this.get('player');
    	},

    	registered: function() {
    		return new Promise(function(resolve, reject) {
    			$.ajax({ 
	                url: "/api/user",
	                
	                type: "PUT",
	                
	                dataType: "json",
	                
	                contentType: "application/json",

	                data: JSON.stringify({ 
	                    login: this.login,
	                    password: this.password,
	                    email: this.email,
	                    avatar: this.avatar
	                }),
	                
	                success: function(player) {                      
	                    console.log("...REGISTRATION SUCCESS!");
	                    resolve();
	                },

	                error: function(xhr, error_msg, error) {
	                    console.log("...REGISTRATION ERROR!\n" + xhr.status + " " + error_msg); 
	                    reject(xhr.status);
	                } 
	            });	// ajax
    		});	// Promise    		
    	},	// registered

    	validate: function(attrs) {
			var errors = {},
				reg = '',
				invalid = false;

			if (!attrs.login) {
				errors['login'] = 'Please fill this field';
				invalid = true;
			} else {
				if (attrs.password.length < 5) {
					errors['login'] = 'Too short login (< 5)';
					invalid = true;
				}
				if (attrs.password.length > 15) {
					errors['login'] = 'Too long login (> 15)';
					invalid = true;
				}
			}

			if (!attrs.password) {
				errors['password'] = 'Please fill this field';
				invalid = true;
			} else {
				if (attrs.password.length < 6) {
					errors['password'] = 'Too short password (< 6)';
					invalid = true;
				}
			}

 			if (!attrs.email) {
				errors['email'] = 'Please fill this field';
				invalid = true;
			} else {
				reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
				if (!reg.test(attrs.email)) {
					errors['email'] = 'Please enter correct email';
					invalid = true;
				}
			}

			if (invalid) {
				return errors;
			}
		}	// validate
    });	// UserModel
    
    return UserModel;
});