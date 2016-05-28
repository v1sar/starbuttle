define([
	'backbone',
	'./userSync',
	'./player'
], function(
	Backbone,
	userSync,
	PlayerModel
) {    
    var UserModel = Backbone.Model.extend({
    	defaults: {
    		id: null,
    		login: null,
    		email: null,
    		password: null,
    		avatar: null
    	},

    	url: '/api/user',

    	sync: userSync,
    	
    	initialize: function() {
    		this._player = new PlayerModel();
    	},

    	toJSON: function() {
			return JSON.stringify(
                _.clone(this.attributes)
            );
    	},

    	// For Sign Up
    	toNotFullJSON: function() {
    		return JSON.stringify({
    			login: this.get('login'),
    			email: this.get('email'),
    			password: this.get('password')
    		});
    	},

    	asPlayer: function() {
    		return this._player;
    	},

    	validate: function(attrs) {
			var errors = {},
				reg = '',
				invalid = false;

			if (!attrs.login) {
				errors.login = 'Please fill this field';
				invalid = true;
			} else {
				if (attrs.login.length > 15) {
					errors.login = 'Too long login (> 15)';
					invalid = true;
				}
			}

			if (!attrs.password) {
				errors.password = 'Please fill this field';
				invalid = true;
			} else {
				if (attrs.password.length < 6) {
					errors.password = 'Too short password (< 6)';
					invalid = true;
				}
			}

 			if (!attrs.email) {
				errors.email = 'Please fill this field';
				invalid = true;
			} else {
				reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
				if (!reg.test(attrs.email)) {
					errors.email = 'Please enter correct email';
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