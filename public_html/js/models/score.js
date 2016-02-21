define(['backbone'], function(Backbone) {
    var PlayerScoreModel = Backbone.Model.extend({
    	name: '',
    	score: 0
    });
    
    return new PlayerScoreModel();
});