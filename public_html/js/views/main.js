define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({

        template: tmpl,
        initialize: function () {
            $('#page').html(tmpl());
            $('#main').hide();
        },
        render: function () {
            // TODO
        },
        show: function () {
            $('#main').show();
        },
        hide: function () {
            // TODO
        }

    });

    return new View();
});