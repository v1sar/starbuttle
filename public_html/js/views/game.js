define(function(require) {
    
    function gameWorldCSS() {
        $('html body')
            .css('padding', '0px')
            .css('margin', '0px')
            .css('height', '100%')
            .css('height', '100vh')
            .css('overflow', 'hidden');

        $('body').removeClass('app');
    }

    //gameWorldCSS();

    var Backbone = require('backbone'),
        World = require('three_world'),
        tmpl  = require('tmpl/game');

    var GameView = Backbone.View.extend({
        template: tmpl,

        id: 'game',

        initialize: function () {
            this._world = World;
            
            this._world.init({ 
                renderCallback: this.renderWorld,
               //container: this.$el,
                clearColor: 0x000022
            });

            this.listenTo(this, 'rendered', this.startGameWorld);
        },

        render: function() {
            this.$el.html(this.template());
            this.trigger('rendered');
            return this;
        },

        show: function () {
            this.trigger('show');
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        },

        startGameWorld: function() {
            this._world.getScene().fog = new THREE.FogExp2(0x0000022, 0.00125)
            
            var tunnel = new THREE.Mesh(
                new THREE.CylinderGeometry(100, 100, 5000, 24, 24, true),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture('../../images/space.jpg', null, function(tex) {
                        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
                        tex.repeat.set(5, 10)
                        tex.needsUpdate = true
                    }),
                    side: THREE.BackSide
                })
            );
                
            tunnel.rotation.x = -Math.PI / 2;
            this._world.add(tunnel);
            /***/

            var loader = new THREE.JSONLoader(),//new THREE.OBJLoader(),
                player = null,
                view = this;
            
            /*
            loader.load(
                '../../3D_models/space-ship.obj', 
                '../../3D_models/space-ship.mtl', 
                function(object) {
                   // object.scale.set(0.2, 0.2, 0.2);
                   // object.rotation.set(0, Math.PI, 0);
                   // object.position.set(0, -25, 0);
                    console.log(object);
                    // player = object;
                    // view._world.add(player);
                },
                // Download progress
                function(xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // Download error
                function(xhr) {
                    console.log('An error happened with model');
                }
            );*/

            loader.load(
                '../../3D_models/trylvl.json',
                function(geometry, materials) {
                    player = new THREE.Mesh(
                        geometry, 
                        new THREE.MeshFaceMaterial(materials)
                    );

                    player.position.set(0, -25, 0);
                    player.scale.x = player.scale.y = player.scale.z = 0.75;
                    player.tranlation = THREE.GeometryUtils.center(geometry);
                    player.receiveShadow = true;

                    view._world.add(player);
                }
            );

            this._world.start();
        }
    });

    return GameView;
});
