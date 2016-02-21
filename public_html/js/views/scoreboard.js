define([
    'backbone',
    'tmpl/scoreboard'
], function(
    Backbone, 
    tmpl
){
    var PlayerScoreView = Backbone.View.extend({
        tagName: "li",
        className: "score__item",
        template: tmpl,
        initialize: function () {
            // При любых изменениях в моделе, перерисовываем представление
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        show: function () {
            // TODO
        },
        hide: function () {
            // TODO
        },
        events: {

        },
    });

    return new PlayerScoreView();
});

/*
$el - Закешированный объект jQuery c элементом данного представления — то же самое, что $(this.el). 
Удобная ссылка — замена постоянному оборачиванию DOM-элемента. 

view.$el.show();
listView.$el.append(itemView.el)
*/