define([
    'backbone', 
    'views/main',
    'views/login',
    'views/scoreboard',
    'views/game'
], function(
    Backbone, 
    mainView,
    loginView,
    scoreboardView,
    gameView
){
    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'login': 'loginAction',
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
        }
    });

    return new Router();
});