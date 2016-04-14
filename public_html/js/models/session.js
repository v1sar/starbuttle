define([
    'backbone',
    './player'
], function (
    Backbone,
    PlayerModel
) {

    var SessionModel = Backbone.Model.extend({
       	url: 'http://localhost:8091/api/session',
    	
        initialize: function() {
        	this.player = new PlayerModel();
        },

        getCurrentPlayer: function() {
        	return this.player;
        },

        login: function(uLogin, uPassword) {
        	var url = this.url;

        	$.ajax({ 
                url: "http://127.0.0.1:8091/api/user",
                
                type: "GET",
                
             //  dataType: "json",
                
                //contentType: "application/json",

           //      data: JSON.stringify({ 
           //          login: uLogin,
        			// password: uPassword
           //      }),
                
                success: function(json) {                      
                    console.log("...SUCCESS!");
                    console.log(json); 
                },

                error: function(xhr, error_msg, error) {
                    console.log("...ERROR!\n" + xhr.status + " " + error_msg); 
                }
            });
        }
    });

    return SessionModel;
});
