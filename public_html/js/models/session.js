define([
    'backbone',
    './sync/sessionSync',
    './user'
], function (
    Backbone,
    sessionSync,
    UserModel
) {
    var SessionModel = Backbone.Model.extend({   	
        defaults: {
            login: '',
            password: '',
            remember: false
        },

        url: '/api/session',

        sync: sessionSync,
        
        id: '1',    // for DELETE

        initialize: function() {
        	this._user = new UserModel();

            this.fetch();
        },

        toJSON: function() {
            return JSON.stringify(
                _.clone(this.attributes)
            );
        },

        isSigned: function() {
            return !!this._user.get('id');
        },

        clearUser: function() {
            this._user.clear().set(this._user.defaults);
        },

        setPlayer: function(playerData) {
            this._user.set({'player': playerData});
        },

        getUser: function() {
        	return this._user;
        }
    }); // SessionModel

    return new SessionModel();
});
