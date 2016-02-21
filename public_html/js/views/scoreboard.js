define([
    'backbone',
    'tmpl/scoreboard',
    'collections/scores'
], function(
    Backbone, 
    tmpl,
    players
){
    var PlayerScoreView = Backbone.View.extend({
        // tagName: "li",
        // className: "score__item",
        template: tmpl,
        initialize: function () {
            // При любых изменениях в моделе, перерисовываем представление
            //this.listenTo(this.model, "change", this.render);
            // $('#scoreboard').hide();
        },
        render: function () {
            // this.$el.html(this.template(this.model.attributes));
            // return this;
        },
        show: function () {
            $('#page').html(tmpl({collection: players.toJSON()}));
            // $('#scoreboard').show(); 
        },
        hide: function () {
            $('#page').html('');
            //$('#scoreboard').hide();
        },
        events: {

        },
    });

    return new PlayerScoreView();
});
