define([
	'backbone'
], function(
	Backbone
) {
    
    var PlayerModel = Backbone.Model.extend({
    	defaults: {
    		email: '_',
    		password: '_',
    		nickname: '_',
    		score: 0
    	},

    	validate: function(attrs) {
			if (!(attrs.email && attrs.password && attrs.nickname)) {
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