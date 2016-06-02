define(function(require) {
    
    var Backbone = require('backbone'),
        MainView = require('views/main'),
        SignInView = require('views/sign-in'),
        ScoreboardView = require('views/scoreboard'),
        GameView = require('views/game'),
        SignUpView = require('views/sign-up');
        activeSession = require('models/session');

    var app = require('views/app');
    app.setViews({
        'main': MainView,
        'signIn': SignInView,
        'scoreboard': ScoreboardView,
        'game': GameView,
        'signUp': SignUpView
    });

    var Router = Backbone.Router.extend({
        initialize: function() {
            this.listenTo(activeSession.getUser(), 'login', this.reRenderMain);
            this.listenTo(activeSession, 'logout', this.rootAction);
        },

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
            this.authRequired('game');
        },

        signInAction: function () {
            this.nonAuthRequired('signIn');
        },
        
        signUpAction: function () {
            this.nonAuthRequired('signUp');
        },

        rootAction: function() {
            // this.navigate('/', {trigger: true});     // not working
            $(location).attr('href', '/');
        },

        reRenderMain: function() {
            app.getView('main').render();   /// БАААААГ
        },

        authRequired: function(viewName) {
            if (activeSession.isSigned()) {
                app.getView(viewName).show();
            } else {
                this.navigate('#signin', {trigger: true})
            }
        },

        nonAuthRequired: function(viewName) {
            if (!activeSession.isSigned()) {
                app.getView(viewName).show();
            }
        }
    });

    return new Router();
});
