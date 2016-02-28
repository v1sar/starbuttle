define(function(require) {
    
    var Backbone = require('backbone'),
        MainView = require('views/main'),
        SignInView = require('views/sign-in'),
        ScoreboardView = require('views/scoreboard'),
        GameView = require('views/game'),
        SignUpView = require('views/sign-up');
    
    var app = require('views/app');
    app.setViews({
        'main': MainView,
        'signIn': SignInView,
        'scoreboard': ScoreboardView,
        'game': GameView,
        'signUp': SignUpView
    });

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'signup': 'signUpAction',
            'signin': 'signInAction',
            '*default': 'defaultActions'
        },

        defaultActions: function () {
            // TODO: 404_view
            app.getView('main').show();
        },

        scoreboardAction: function () {
            app.getView('scoreboard').show();
        },

        gameAction: function () {
            app.getView('game').show();
        },

        signInAction: function () {
            app.getView('signIn').show();
        },
        
        signUpAction: function () {
            app.getView('signUp').show();
        }
    });

    return new Router();
});
