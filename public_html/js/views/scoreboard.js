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
        tagName: "li",
        className: "score__item",
        template: tmpl,
        initialize: function () {
            // При любых изменениях в моделе, перерисовываем представление
            //this.listenTo(this.model, "change", this.render);
            $('#page').html(tmpl());
            // $('#scoreboard').hide();
        },
        render: function () {
            // this.$el.html(this.template(this.model.attributes));
            // return this;
            $('#page').html(tmpl());
        },
        show: function () {
            $('#page').html(tmpl());
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
