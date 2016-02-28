define([
    'backbone',
    'tmpl/sign-up'
], function(
    Backbone,
    tmpl
) {
    var registrationView = Backbone.View.extend({
        template: tmpl,

        tagName: 'div',

        id: 'sign-up',

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

    return registrationView;
});
