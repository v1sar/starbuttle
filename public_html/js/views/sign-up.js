define([
    'backbone',
    'models/player',
    'collections/players',
    'tmpl/sign-up'
], function(
    Backbone,
    PlayerModel,
    players,
    tmpl
) {
    var RegistrationView = Backbone.View.extend({
        newPlayer: new PlayerModel(),

        collection: players,

        template: tmpl,

        id: 'sign-up',

        form: '#sign-up-form',

        events: {
            'submit #sign-up-form': 'addPlayer'
        },

        initialize: function () {
            this.listenTo(this.newPlayer, 'invalid', this.showErrorMsg);
            this.listenTo(this.collection, 'add', this.showSuccessMsg);
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        show: function () {
            this.trigger('show');
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        },

        showErrorMsg: function(model, error) {
            var alertError = this.$el.find('#signup-alert'),
                alertText = this.$el.find('#signup-alert-text');

            alertError.hide();

            if (alertError.hasClass('alert-success')) {
                alertError.toggleClass('alert-success alert-danger');
            }

            alertText.text(error);            
            alertError.fadeIn();
            
            // setTimeout(function() {
            //     alertError.fadeOut();
            // }, 5000);
        },

        showSuccessMsg: function(player) {
            var alertSuccess = this.$el.find('#signup-alert'),
                alertText = this.$el.find('#signup-alert-text');

            alertSuccess.hide();

            if (alertSuccess.hasClass('alert-danger')) {
                alertSuccess.toggleClass('alert-danger alert-success');
            }

            alertText.text('Вы успешно зарегистированы как');
            alertText.append('</br><a href="/#signin" class="alert-link">' + player.get('nickname') + '</a>');
            alertSuccess.fadeIn();
        },

        addPlayer: function(event) {                   
            var newPlayer = {
                email: this.$el.find('input[name="email"]').val(),
                password: this.$el.find('input[name="password"]').val(),
                nickname: this.$el.find('input[name="nickname"]').val()
            }   
            
            this.newPlayer.set(newPlayer);

            if (this.newPlayer.isValid()) {
                this.collection.add(this.newPlayer);
                return false;                            // TODO: true: AJAX to JAVA-server
            }

            return false;                               // event.preventDefault();
        }
    });

    return RegistrationView;
});
