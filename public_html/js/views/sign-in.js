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
        }
    });

    return LoginView;
});