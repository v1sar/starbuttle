define(function(require)) {
	var THREE = require('three');

	var Shot = function(position) {
		this._mesh = new THREE.Mesh(
	   		new THREE.SphereGeometry(3, 16, 16),
	   		new THREE.MeshBasicMaterial({
				color: 0xff0000,
				transparent: true,
				opacity: 0.5
			})
		);

		this._mesh.position.copy(position);

		this.getMesh = function() {
            return this._mesh;
        }
	}

	return Shot;
};