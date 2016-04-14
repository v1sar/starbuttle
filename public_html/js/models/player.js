define([
	'backbone'
], function(
	Backbone
) {
    
    var PlayerModel = Backbone.Model.extend({
    	defaults: {
    		id: 0,
    		email: '_',
    		password: '_',
    		login: '_',
    		score: 0
    	},

    	validate: function(attrs) {
			if (!(attrs.email && attrs.password && attrs.login)) {
				return 'Пожалуйста, заполните все поля';
			}
 			
 			var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if (!reg.test(attrs.email)) {
				return 'Пожалуйста, введите корректный email';
			}

			if (attrs.password.length < 5) {
				return 'Слишком короткий пароль'
			}
		}
    });
    
    return PlayerModel;
});