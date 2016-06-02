define([
	'backbone',
    'three',
    '../game/models/spacecraft',
    '../game/models/shot'
], function(
	Backbone,
    THREE,
    Spacecraft,
    Shot
) {    

    var PlayerModel = Backbone.Model.extend({
    	defaults: {
    		id: 0,
    		score: 0,
    		health: 100,
            x: 0,
            y: 0,
            z: 0
    	},

        url: '/api/game',

        initialize: function() {
            this._spacecraft = new Spacecraft(this.get('x'), this.get('y'), this.get('z'));
        },

        getMesh: function() {
            return this._spacecraft.getMesh();
        },

        toJSON: function() {
            return JSON.stringify(
                _.clone(this.attributes)
            );
        },

        update: function(cameraPosition) {
            var player = this;
            
            player.set({
                x: cameraPosition.x,
                y: cameraPosition.y - 2,    // константы при создании
                z: cameraPosition.z - 20
            });
        },

        getPositionInWorld: function() {
            return this.getMesh().matrixWorld;
        }
        /*
        createShot: function(camera, event) {
            var projector = new THREE.Projector(),
                shot = new Shot(new THREE.Vector3(this.get('x'), this.get('y'), this.get('z')));

            var vector = new t.Vector3(mouse.x, mouse.y, 1);
            projector.unprojectVector(vector, );
            sphere.ray = new t.Ray(
                obj.position,
                vector.subSelf(obj.position).normalize()
            );
        }*/
    });
    
    return PlayerModel;
});
