define([
    'backbone',
    'tmpl/sign-in',
    '../models/session'
], function(
    Backbone,
    tmpl,
    activeSession
) {
    var LoginView = Backbone.View.extend({

        template: tmpl,

        id: 'sign-in',

        model: activeSession,

        events: {
            'submit .js-sign-in-form': 'signin',
        },

        initialize: function () {
            this.listenTo(activeSession, 'loginError', this.showError);
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

        showError: function() {
            this.$('.js-alert-error').fadeIn();
        },

        signin: function(event) {
            event.preventDefault();

            var session = this.model;
                $login = this.$('input[name="login"]').val(),
                $password = this.$('input[name="password"]').val(),
                $remember = !!this.$('input[name="remember"]:checkbox:checked').val();

            this.$('.js-sign-in-form')[0].reset();
            
            session.save(
                { 
                    login: $login,
                    password: $password,
                    remember: $remember
                }, 
                {
                    isNew: true
                }
            );
        }
    });

    return LoginView;
});