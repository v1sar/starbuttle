define(function(require) {
	var THREE = require('three'),
        loadingManager = require('./loadmanager');

    var Spacecraft = function(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;

        this._mesh = null;
    }
    
    Spacecraft.prototype.getMesh = function() {
        var loader = new THREE.JSONLoader(loadingManager),
            spacecraft = this;
        
        return new Promise(function(resolve, reject) {
            if (spacecraft._mesh) {
                resolve(spacecraft._mesh);
            }

            loader.load(
                'js/game/3D_models/spacecraft.json',   // ../ not working
                function(geometry, materials) {
                    var mesh = new THREE.Mesh(
                        geometry, 
                        new THREE.MeshFaceMaterial(materials)
                    );

                    mesh.position.set(spacecraft._x, spacecraft._y, spacecraft._z);
                    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
                    mesh.rotateY(Math.PI); 
                    mesh.tranlation = geometry.center();
                    mesh.receiveShadow = true;
                    
                    spacecraft._mesh = mesh;
                    resolve(mesh);
                }
            );
        }); // Promise
    }   // loadMesh

    return Spacecraft;
});
