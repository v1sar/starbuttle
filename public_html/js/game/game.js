define(function(require) {
    var World = require('./models/world'),
        Sphere = require('./models/sphere'),
        // Shot = require('./game_models/shot'),
        Player = require('../models/player'),
        Spacecraft = require('./models/spacecraft');

    var Game = function(worldContainer) {
        var game = this;

        game._world = new World({
            renderCallback: render,
            clearColor: 0x000022,
            container: worldContainer
        });
        
        game._clock = new THREE.Clock();

        // Sphere
        game._world.getScene().fog = new THREE.FogExp2(0x0000022, 0.00125);        

        // Render
        function render() {
            var delta = game._clock.getDelta();
            game._controls.update(delta);
            game._player.sendData();
            /* TODO: shots
            for (var i = 0; i < shots.length; i++) {
                if (!shots[i].update(camera.position.z)) {
                    World.getScene().remove(shots[i].getMesh());
                    shots.splice(i, 1);
                }
            } 
            */   
        }
    }

    Game.prototype.getWorld = function() {
        return this._world;
    }
    
    Game.prototype.start = function() {
        var game = this,
            controls = null;

        game._player = new Player({x: 0, y: -3, z: -20 });
        game._enemy = new Player({x: 0, y: 10, z: -30 });

        // Players
        Promise.all([
            new Sphere(1000).getMesh(),
            game._player.getMesh(),
            game._enemy.getMesh(),
        ]).then(function(results) {
            results.forEach(function(mesh) {
                game._world.add(mesh);
            });

            game._world.getCamera().add(results[1]);

            game._controls = new THREE.FlyControls(game._world.getCamera(), game._world.getContainer());

            // game._controls.dragToLook = true;
            game._controls.autoForward = true;
            game._controls.movementSpeed =  20;
            game._controls.rollSpeed = Math.PI / 10;

            game._world.start();
        })
    } 

    return Game;

    /* TODO: shots
    window.addEventListener('keyup', function(e) {
        switch(e.keyCode) {
            case KEY_ONE: {  // Клавиша "1"
                var spacecraft = player.getMesh();
                var shot = new Shot(spacecraft.position);

                shots.push(shot);
                World.add(shot.getMesh());
            } break;
        }
    }); */

    var a = websoce.create(
        onMessage(
                // двигаю врага
            )
    )

    
});
