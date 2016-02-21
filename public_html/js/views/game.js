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
            // $('#game').hide();
        },
        render: function () {
            $('#page').html(tmpl());
        },
        show: function () {
            $('#page').html(tmpl());
            // $('#game').show();
        },
        hide: function () {
            $('#page').html('');
            //$('#game').hide();
        }

    });

    return new gameView();
});