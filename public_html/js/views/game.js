define([
    'backbone',
    'tmpl/game'
], function(
    Backbone,
    tmpl
) {
    var GameView = Backbone.View.extend({
        template: tmpl,

        id: 'game',

        events: {
            'mousemove #game-field': 'moveSpaceCraft'
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

        moveSpaceCraft: function(event) {
            var $spaceCraft = this.$el.find('#space-craft');

            $spaceCraft
                .css('left', (event.pageX - 75) + 'px')
                .css('top', (event.pageY - 75) + 'px');  
        }
    });

    return GameView;
});
