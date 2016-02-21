define([
	'backbone',
	'models/score'
], function(
	Backbone,
	playerModel
){

    var PlayerScoreCollection = Backbone.Collection.extend({
    	model: playerModel,
    	comparator: function(player) {
            return -player.get('score');    // Минус!
        }
    });

    var players = new PlayerScoreCollection([
    	{name: 'Alex', score: 5},
    	{name: 'Yura', score: 15},
    	{name: 'Dmitriy', score: 25},
    	{name: 'Karina', score: -2},
    	{name: 'Nastya', score: 30},
    	{name: 'Judjin', score: 2},
    	{name: 'Maxim', score: 25},
    	{name: 'Anthony', score: 0},
    	{name: 'Victor', score: 1}
    ]);

    return players;
});