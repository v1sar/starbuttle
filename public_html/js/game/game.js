define(function(require) {
    var World = require('./models/world'),
        Sphere = require('./models/sphere'),
        Player = require('../models/player'),
        Shot = require('./models/shot'),
        Spacecraft = require('./models/spacecraft');

    var URL = '/api/game';
    var CMD_START = 'START',
        CMD_ENEMY_SHOT = 'ENEMY_SHOT',
        CMD_WIN = 'WIN',
        CMD_LOSE = 'LOSE',
        SGNL_CREATE_SHOT = 'CREATE_SHOT';

    var world, status, clock, controls, player, enemy, enemyCamera, sphere;

    var socket;

    var shots = [];

    function isIntersection(boxA, boxB) {
        return boxA.intersectsBox(boxB);
    }

    function render() {
        var delta = clock.getDelta();
        controls.update(delta);

        updatePlayer();

        var lastHealth;
        for (var i = 0; i < shots.length; i++) {
            shots[i].update();

            if (isIntersection(shots[i]._hitbox, player._spacecraft._hitbox)) {
                console.log('В вас попали');
                world.remove(shots[i].getMesh());
                shots.splice(i, 1);

                lastHealth = player.get('health');
                player.set({ health: lastHealth - 10 });
            } else if (!isIntersection(shots[i]._hitbox, sphere._hitbox)) {
                //console.log('За пределами мира');
                world.remove(shots[i].getMesh());
                shots.splice(i, 1);
            }
        }    
    };

    function updatePlayer() {
        var camPosition = world.getCamera().position,
            camRotation = world.getCamera().rotation;

        player.update(camPosition, camRotation);
    }

    function createConnection() {
        socket = new WebSocket('ws://' + window.location.hostname + ':' + window.location.port + URL);
        
        socket.onopen = function() {
            console.log('Соединение с игровой комнатой установлено.');
            status.connected = true;
        };

        socket.onclose = function(event) {
            if (event.wasClean) {
                console.log('Соедение с игровой комнатой закрыто чисто.');
            } else {
                console.log('Обрыв соединения.');
            }
            
            console.log('Код: ' + event.code + ', причина: ' + event.reason);

            status.connected = false;
            status.gaming = false;

            createConnection();
        };

        socket.onmessage = function(event) {
            //console.log('Получены данные ' + event.data);

            var data = JSON.parse(event.data);

            if (data.command === CMD_START) {
                status.gaming = true;
                return;
            } 

            if (status.gaming) {
                enemyCamera.position.x = data.posX;
                enemyCamera.position.y = data.posY;
                enemyCamera.position.z = data.posZ;

                enemyCamera.rotation.x = data.rotX;
                enemyCamera.rotation.y = data.rotY;
                enemyCamera.rotation.z = data.rotZ;

                var camPosition = enemyCamera.position,
                    camRotation = enemyCamera.rotation;

                enemy.update(camPosition, camRotation);

                if (data.command !== undefined) {
                    if (data.command === CMD_ENEMY_SHOT) {
                        createShot(enemyCamera, enemy, false);
                    } else if (data.command === CMD_WIN) {
                        status.gaming = false;
                        status.connected = false;
                        socket = null;

                        alert('Вы победили!');

                        $(location).attr('href', '/');
                    } else if (data.command === CMD_LOSE) {
                        status.gaming = false;
                        status.connected = false;
                        socket = null;

                        alert('Вы уничтожены! :(');

                        $(location).attr('href', '/');
                    }
                }
            }
        };

        socket.onerror = function(error) {
            console.log('Ошибка ' + error.message);
            
            if (error.code !== 403) {
                status.connected = false;
                status.game = false;
                createConnection();
            }
        };
    }

    function sendData(data) {
        if (status.connected) {            
            if (status.gaming) {
                console.log('Send data: ' + data);
                socket.send(data);
            }
        }
    }

    function sendPlayerData() {
        sendData(player.toJSON());
    }

    function createShot(camera, player, signal = true) {
        var raycaster = new THREE.Raycaster();

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition(player.getPositionWorld());
        var shot = new Shot(vector);

        raycaster.setFromCamera(vector, camera);

        shot._ray = new THREE.Ray(
            camera.position,
            vector.sub(camera.position).normalize()
        );

        shots.push(shot);

        if (signal) {
            player.set({ signal: SGNL_CREATE_SHOT });  // hack!
            sendData(player.toJSON());
            player.unset('signal', { silent: true });

            var audio = new Audio();
            audio.src = 'sounds/lazer_effect.wav';
            audio.autoplay = true;
        }

        world.add(shot.getMesh());            
    }

    function configureControls(drag, forward, movSpeed, rollSpeed) {
        controls.dragToLook = drag;
        controls.autoForward = forward;
        controls.movementSpeed =  movSpeed;
        controls.rollSpeed = rollSpeed;
    }

    // *** //
    var Game = function(worldContainer) {
        status = {
            connected: false,
            gaming: false
        };

        world = new World({
            renderCallback: render,
            clearColor: 0x000022,
            container: worldContainer
        });
        
        clock = new THREE.Clock();

        world.getScene().fog = new THREE.FogExp2(0x0000022, 0.00125);   


        enemyCamera = new THREE.PerspectiveCamera(
            45,
            world.getContainer().width / world.getContainer().height,
            1,
            2000
        );

        player = new Player({posX: 0, posY: -2, posZ: -20 });
        enemy = new Player({posX: 0, posY: -2, posZ: -20 });
        sphere = new Sphere(700);
    }

    Game.prototype.start = function() {
        Promise.all([
            sphere.getMesh(),
            player.getMesh(),
            enemy.getMesh(),
        ]).then(function(results) {
            results.forEach(function(mesh) {
                world.add(mesh);
            });

            enemyCamera.add(results[2]);
            world.add(enemyCamera);

            world.getCamera().add(results[1]);
            controls = new THREE.FlyControls(world.getCamera(), world.getContainer());

            configureControls(false, false, 30, 1); // drag, forward, movSpeed, rollSpeed

            world.start();
            createConnection();
            setInterval(sendPlayerData, 60);

            $(document).on('click', function (event) {
                createShot(world.getCamera(), player);               
            })
        }); // PROMISE
    } // Game.start

    return Game;
});
