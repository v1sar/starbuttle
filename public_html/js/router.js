define([
    'backbone',
    'views/main',
    'views/login',
    'views/scoreboard',
    'views/game',
    'views/registration'
], function(
    Backbone,
    mainView,
    loginView,
    scoreboardView,
    gameView,
    registrationView
){
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
