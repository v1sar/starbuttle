define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var mainView = Backbone.View.extend({

        template: tmpl,
        initialize: function () {
            $('#page').html(tmpl());
            // $('#main').hide();
        },
        render: function () {
            $('#page').html(tmpl());
        },
        show: function () {
            $('#page').html(tmpl());
            // $('#main').show();
        },
        hide: function () {
            $('#page').html('');
            // $('#main').hide();
        }

    });

    return new mainView();
});