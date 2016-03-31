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
            'click #webcamera_btn': 'cameraPublish',
            'change #choose': 'fileUpload'
        },

        initialize: function () {
            this.listenTo(this.newPlayer, 'invalid', this.validationMsg);
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
            this.$('#signup-alert').hide();
            this.$el.hide();
        },

        showErrorMsg: function(errorText) {
            var $alertError = this.$('#signup-alert'),
                $alertText = this.$('#signup-alert-text');

            $alertError.hide();

            if ($alertError.hasClass('alert-success')) {
                $alertError.toggleClass('alert-success alert-danger');
            }

            $alertText.text(errorText);            
            $alertError.fadeIn();
            
            // setTimeout(function() {
            //     alertError.fadeOut();
            // }, 5000);
        },

        validationMsg: function(model, error) {
            this.showErrorMsg(error);
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

        cameraPublish: function() {
            var $preview = this.$('#preview'),
                $webcamera_btn = this.$('#webcamera_btn'),
                $shot_btn = this.$('#shot_btn'),
                $default_img = this.$('#default_img');

            $webcamera_btn.hide();
            $shot_btn.show();

            FileAPI.avatar = null;

            FileAPI.Camera.publish(preview, { width: 170, height: 170 }, function (err, cam) {
                if (err) {
                    alert('WebCam or Flash not supported!');
                    return;
                } 

                FileAPI.event.on(shot_btn, 'click', function (){
                    if(cam.isActive()) {
                        var shot = cam.shot();

                        shot.preview(170).get(function (err, img){
                            $default_img.hide();
                            $preview.children('video').remove();
                            $preview.children('canvas').remove();
                            preview.appendChild(img);
                        });

                        FileAPI.avatar = FileAPI.Image(shot);
                        
                    } else {
                        alert('Web camera is turned off!');
                        $default_img.show();
                    }

                    $shot_btn.hide();
                    $webcamera_btn.show()
                });
            });
        },

        fileUpload: function(event) {
                var $preview = this.$('#preview'),                    
                    $default_img = this.$('#default_img');
                    
                var files = FileAPI.getFiles(event);

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

                        FileAPI.avatar = file;  // Храним аватар прямо в объекте API, а как его еще выцеить отсюда в отправку формы?
                        
                        FileAPI.Image(file).preview(170).get(function(err, img) {           
                            $default_img.hide();
                            $preview.children('canvas').remove();
                            preview.appendChild(img);       //  BUT $preview NOT WORKING?????!
                        });
                    }
                });
            
        },   // fileUploadInit
        
        addPlayer: function(event) {                   
            event.preventDefault();

            var newPlayer = {
                email: this.$('input[name="email"]').val(),
                password: this.$('input[name="password"]').val(),
                nickname: this.$('input[name="nickname"]').val()
            }   

            this.newPlayer.set(newPlayer);

            if (this.newPlayer.isValid()) {

                // TODO: -> AJAX
                /* FileAPI.upload({
                    url: '/uploads',
                    files: { 
                        images: FileAPI.avatar },
                    complete: function (err, xhr){ 
                        if (err) {
                            alert('error');
                        }
                        alert('complete');
                    }
                }); */

                var regView = this;

                $.ajax({ 
                    url: "/api/user",
                    
                    type: "PUT",
                    
                    dataType: "json",
                    
                    contentType: "application/json",

                    data: JSON.stringify({ 
                        login: newPlayer.nickname,
                        password: newPlayer.password,
                        email: newPlayer.email
                    }),
                    
                    success: function(json) {                      
                        console.log("...SUCCESS!");
                        console.log(json); 
                        regView.collection.add(newPlayer);
                    },

                    error: function(xhr, error_msg, error) {
                        console.log("...ERROR!\n" + xhr.status + " " + error_msg); 
                        regView.showErrorMsg('Пользователь с таким email уже существует!');
                    }
                });

                this.$('#sign-up-form')[0].reset();
            }
        }

    }); // RegistrationView

    return RegistrationView;
});
