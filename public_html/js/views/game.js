define([
    'backbone',
    'tmpl/game'
], function(
    Backbone,
    tmpl
){

    var gameView = Backbone.View.extend({

        template: tmpl,
        initialize: function () {
            $('#page').html(tmpl());
            $('#game').hide();
        },
        render: function () {
            // TODO
        },
        show: function () {
            $('#game').show();
        },
        hide: function () {
            $('#game').hide();
        }

    });

    return new gameView();
});