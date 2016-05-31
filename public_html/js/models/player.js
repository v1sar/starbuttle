define([
	'backbone',
    '../game/models/spacecraft',
], function(
	Backbone,
    Spacecraft
) {    

    var PlayerModel = Backbone.Model.extend({
    	defaults: {
    		id: 0,
    		score: 0,
    		health: 0,
            x: 0,
            y: 0,
            z: 0
    	},

        url: '/api/game',

        initialize: function() {
            this._spacecraft = new Spacecraft(this.get('x'), this.get('y'), this.get('z'));

            this.createConnection();
        },

        getMesh: function() {
            return this._spacecraft.getMesh();
        },

        toJSON: function() {
            return JSON.stringify(
                _.clone(this.attributes)
            );
        },

        createConnection: function() {
            this._gameSocket = new WebSocket('ws://localhost:8090' + this.url);
            
            this._gameSocket.onopen = function() {
                console.log('Соединение с игровой комнатой установлено.');
            };

            this._gameSocket.onclose = function(event) {
                if (event.wasClean) {
                    console.log('Соедение с игровой комнатой закрыто чисто.');
                } else {
                    console.log('Обрыв соединения.');
                }
                
                console.log('Код: ' + event.code + ', причина: ' + event.reason);
            };

            this._gameSocket.onmessage = function(event) {
                console.log('Получены данные ' + event.data);
            };

            this._gameSocket.onerror = function(error) {
                console.log('Ошибка ' + error.message);
            };
        },

        sendData: function() {
            console.log('Send: ' + this.toJSON());
            this._gameSocket.send(this.toJSON());
        }
    });
    
    return PlayerModel;
});
