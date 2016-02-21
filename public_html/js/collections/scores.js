define([
	'backbone',
	'models/score'
], function(
	Backbone,
	player
){

    var PlayerScoreCollection = Backbone.Collection.extend({
    	model: player,
    	comparator: score
    });

    
    var players =  new PlayerScoreCollection([
    	{name: 'Alex', score: 5},
    	{name: 'Yura', score: 15},
    	{name: 'Dmitriy', score: 25},
    	{name: 'Karina', score: -2},
    	{name: 'Nastya', score: 30},
    	{name: 'Judjin', score: 2},
    	{name: 'Maxim', score: 25},
    	{name: 'Anthony', score: 0},
    	{name: 'Victor', score: 1}
    ]).sort();

    return players;
});