define(function(require) {
    
    var Backbone = require('backbone'),
        mainView = require('views/main'),
        loginView = require('views/login'),
        scoreboardView = require('views/scoreboard'),
        gameView = require('views/game'),
        registrationView = require('views/registration');
    
    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'login': 'loginAction',
            'registration': 'registrationAction',
            '*default': 'defaultActions'
        },
        defaultActions: function () {
            mainView.show();
        },
        scoreboardAction: function () {
            // mainView.hide();
            scoreboardView.show();
        },
        gameAction: function () {
            //mainView.hide();
            gameView.show();
        },
        loginAction: function () {
            // mainView.hide();
            loginView.show();
        },
        registrationAction: function () {
            // mainView.hide();
            registrationView.show();
        }
    });

    return new Router();
});
