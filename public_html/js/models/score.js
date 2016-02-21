define([
	'backbone'
], function(
	Backbone
) {
    
    var PlayerScoreModel = Backbone.Model.extend({
    	defaults: {
    		name: '',
    		score: 0
    	}
    });
    
    return PlayerScoreModel;
});