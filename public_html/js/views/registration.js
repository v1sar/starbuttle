define([
    'backbone',
    'tmpl/registration'
], function(
    Backbone,
    tmpl
){

    var registrationView = Backbone.View.extend({

        template: tmpl,
        initialize: function () {
            $('#page').html(tmpl());
            // $('#registration').hide();
        },
        render: function () {
            $('#page').html(tmpl());
        },
        show: function () {
            $('#page').html(tmpl());
            // $('#registration').show();
        },
        hide: function () {
            $('#page').html('');
            //$('#registration').hide();
        }

    });

    return new registrationView();
});
