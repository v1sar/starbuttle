define([
    'backbone',
    'tmpl/login'
], function(
    Backbone,
    tmpl
){

    var loginView = Backbone.View.extend({

        template: tmpl,
        initialize: function () {
            $('#page').html(tmpl());
            // $('#login').hide();
        },
        render: function () {
            $('#page').html(tmpl());
        },
        show: function () {
            $('#page').html(tmpl());
            // $('#login').show();
        },
        hide: function () {
            $('#page').html('');
            //$('#login').hide();
        }

    });

    return new loginView();
});