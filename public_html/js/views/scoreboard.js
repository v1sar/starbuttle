define(function(require) {

    var Backbone = require('backbone'),
        players =  require('collections/scores'),
        playerModel = require('models/score'),
        tmpl = require('tmpl/scoreboard');

    var PlayerScoreView = Backbone.View.extend({
        model: playerModel,

        collection: players,

        template: tmpl,

        tagName: 'div',

        id: 'scoreboard',

        initialize: function () {
            // TODO: this.listenTo(this.collection, "change", this.render);
        },

        render: function () {
            var context = { 
                collection: this.collection.toJSON() 
            };

            this.$el.html(this.template(context));

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

    return PlayerScoreView;
});
