define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
) {
    var mainView = Backbone.View.extend({
        template: tmpl,

        tagName: 'div',

        id: 'main',

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

    return mainView;
});