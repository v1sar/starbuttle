define([
    'backbone',
    'tmpl/sign-in'
], function(
    Backbone,
    tmpl
) {
    var LoginView = Backbone.View.extend({

        template: tmpl,

        id: 'sign-in',

        events: {
            'submit .js-sign-in-form': 'loginPLayer',
        },

        initialize: function () {
            // TODO: listenTo
        },
        
        render: function() {
            this.$el.html(this.template());
            return this;
        },

        show: function () {
            this.trigger('show');
            this.$('.js-alert-error').hide();
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        },

        loginPLayer: function(event) {
            event.preventDefault();

            var session = window.activeSession;
                $login = this.$('input[name="login"]').val(),
                $password = this.$('input[name="password"]').val();

            this.$('.js-sign-in-form')[0].reset();
            
            session.login($login, $password)
                .then(function(id) {
                    return session.getUserData(id);
                })
                .then(function(data) {
                    session.setUser(data);
                    session.trigger('login');
                })
                .catch(function(error) { 
                    console.log(error);
                    this.showLoginError();
                });
        },

        showLoginError: function() {
            this.$('.js-alert-error').fadeIn();
        },
    });

    return LoginView;
});