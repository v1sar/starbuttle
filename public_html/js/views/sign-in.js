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
            // TODO: this.listenTo(...)
        },
        
        render: function() {
            this.$el.html(this.template());
            return this;
        },

        show: function () {
            this.trigger('show');
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        },

        loginPLayer: function(event) {
            event.preventDefault();

            var $login = this.$('input[name="login"]').val(),
                $password = this.$('input[name="password"]').val();

            // window.activeSession.login($login, $password);
            $.ajax({ 
                url: "http://localhost:8091/api/session",
                
                type: "POST",
                
                dataType: "jsonp",  // "json"
                
                contentType: "application/json",

                data: JSON.stringify({ 
                    login: $login,
                    password: $password
                }),
                
                success: function(json) {                      
                    console.log("...SUCCESS!");
                    console.log(json); 
                },

                error: function(xhr, error_msg, error) {
                    console.log("...ERROR!\n" + xhr.status + " " + error_msg); 
                }
            });
        }
    });

    return LoginView;
});