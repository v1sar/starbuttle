window.FileAPI = {
    debug: false,  
    media: true,
    staticPath: '../lib/file_api/'
};   

define(function(require) {   
    var FileAPI = require('fileAPI');

    var Backbone = require('backbone');
        PlayerModel = require('models/player'),
        players = require('collections/players'),
        tmpl  = require('tmpl/sign-up');

    var RegistrationView = Backbone.View.extend({
        newPlayer: new PlayerModel(),

        collection: players,

        template: tmpl,

        id: 'sign-up',

        events: {
            'submit #sign-up-form': 'addPlayer',
            'click #startWebBtn': 'cameraInit',
            'change #choose': 'fileUpload'
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
            var $alertError = this.$('#signup-alert'),
                $alertText = this.$('#signup-alert-text');

            $alertError.hide();

            if ($alertError.hasClass('alert-success')) {
                $alertError.toggleClass('alert-success alert-danger');
            }

            $alertText.text(error);            
            $alertError.fadeIn();
            
            // setTimeout(function() {
            //     alertError.fadeOut();
            // }, 5000);
        },

        showSuccessMsg: function(player) {
            var $alertSuccess = this.$('#signup-alert'),
                $alertText = this.$('#signup-alert-text');

            $alertSuccess.hide();

            if ($alertSuccess.hasClass('alert-danger')) {
                $alertSuccess.toggleClass('alert-danger alert-success');
            }

            $alertText.text('Вы успешно зарегистированы как');
            $alertText.append('</br><a href="/#signin" class="alert-link">' + player.get('nickname') + '</a>');
            $alertSuccess.fadeIn();
        },

        addPlayer: function(event) {                   
            var newPlayer = {
                email: this.$('input[name="email"]').val(),
                password: this.$('input[name="password"]').val(),
                nickname: this.$('input[name="nickname"]').val()
            }   
            
            this.newPlayer.set(newPlayer);

            if (this.newPlayer.isValid()) {
                this.collection.add(this.newPlayer);
                return false;                            // TODO: true: AJAX to JAVA-server
            }

            return false;                               // event.preventDefault();
        },

        cameraInit: function() {
            FileAPI.Camera.publish(preview, { width: 320, height: 173 }, function (err, cam) {
                if (err) {
                    alert('WebCam or Flash not supported :[');
                    return;
                } 

                // readyBox.style.display = '';

                FileAPI.event.on(startBtn, 'click', function (){
                    cam.start();
                });

                // FileAPI.event.on(stopBtn, 'click', function (){
                //     cam.stop();
                // });

                FileAPI.event.on(shotBtn, 'click', function (){
                    if(cam.isActive()) {
                        var shot = cam.shot();

                        shot.preview(170).get(function (err, img){
                            previews.appendChild(img);
                        });

                        // shot
                        //     .clone()
                        //     .preview(100, 100)
                        //     .get(function(err, img) {
                        //         img.style.marginRight = '5px';
                        //         shots.insertBefore(img, shots.firstChild);
                        //     })
                        // ;

                        var file = shot
                            .preview(200, 200)
                            .overlay({
                                  x: 5
                                , y: 5
                                , rel: FileAPI.Image.RIGHT_TOP
                            })
                        ;
                    }
                });
            });
        },

        fileUpload: function(event) {
                var $preview = this.$('#preview'),
                    $default_img = this.$('#default_img'),
                    files = FileAPI.getFiles(event);

                FileAPI.filterFiles(files, function (file, info) {
                    if (!(/^image\//i.test(file.type))) {
                        alert('Invalid file type!');
                        return false;
                    }

                    if (!((info.width > 160) && (info.height > 160))) {
                        alert('The size is too small!');
                        return false;
                    }

                    if (file.size && (file.size > 2 * FileAPI.MB)) {
                        alert('The weight is too large!');
                        return false;
                    }

                    return true;

                }, function(files, rejected) {
                    if (files.length) {
                        var file = files[0];

                        this.avatar = file;
                        
                        FileAPI.Image(file).preview(170).get(function(err, img) {
                            $default_img.hide();            
                            $preview.empty();
                            preview.appendChild(img);       //  BUT $preview NOT WORKING?????!
                        });
                    }
                });

                  // Загружаем файлы
                // FileAPI.upload({
                //     url: './ctrl.php',
                //     files: { images: files },
                //     progress: function (evt){ /* ... */ },
                //     complete: function (err, xhr){ /* ... */ }
                // });
            
        }   // fileUploadInit
   
    }); // RegistrationView

    return RegistrationView;
});
