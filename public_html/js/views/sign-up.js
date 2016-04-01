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
            'submit .js-sign-up-form': 'addPlayer',
            'click .js-webcamera-btn': 'cameraPublish',
            'change .js-choose': 'fileUpload'
        },

        initialize: function () {
            this.listenTo(this.newPlayer, 'invalid', this.errorRegMsg);
            this.listenTo(this.collection, 'add', this.successRegMsg);
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
            this.$('.js-alert').hide();
            this.$el.hide();
        },

        showMessage: function(type /* error or success */, text, link, textLink) {
            this.$('.js-alert').hide();

            var $alert = this.$('.js-alert-' + type),
                $alertText = this.$('.js-alert-' + type + '-text'),
                $alertLink = this.$('.js-alert-' + type + '-link');

            $alertText.text(text);            
            if (typeof textLink !== undefined) {
                $alertLink.attr("href", link)
                $alertLink.text(textLink);
            }

            $alert.fadeIn();            
       
            // setTimeout(function() {
            //     $alert.fadeOut();
            // }, 5000);
        },

        errorRegMsg: function(model, error) {
            this.showMessage('error', error);
        },

        successRegMsg: function(player) {
            var text = 'Вы успешно зарегистрированы как',
                link = '/#signin',
                linkText = player.get('nickname');

            this.showMessage('success', text, link, linkText);
        },

        cameraPublish: function() {
            var $preview = this.$('.js-preview'),
                $webcameraBtn = this.$('.js-webcamera-btn'),
                $shotBtn = this.$('.js-shot-btn'),
                $fileUploadInput = this.$('.js-choose'),
                $defaultImg = this.$('.js-default-img');

            $webcameraBtn.hide();
            $shotBtn.show();

            FileAPI.avatar = null;

            FileAPI.Camera.publish($preview, { width: 170, height: 170 }, function (err, cam) {
                if (err) {
                    alert('WebCam or Flash not supported!');
                    return;
                } 

                $shotBtn.on('click', function() {
                    if(cam.isActive()) {
                        var shot = cam.shot();

                        shot.preview(170).get(function (err, img){
                            $defaultImg.hide();
                            $preview.children('video').remove();
                            $preview.children('canvas').remove();
                            $preview.append(img);
                        });

                        FileAPI.avatar = FileAPI.Image(shot);
                        
                    } else {
                        alert('Web camera is turned off!');
                        $defaultImg.show();
                    }

                    $shotBtn.hide();
                    $webcameraBtn.show();
                });

                $fileUploadInput.on('change', function() {
                    $shotBtn.hide();
                    $webcameraBtn.show();
                });                
            }); // FileAPI.Camera.publish()
        },

        fileUpload: function(event) {
                var $preview = this.$('.js-preview'),                    
                    $defaultImg = this.$('.js-default-img');
                    
                var files = FileAPI.getFiles(event);

                FileAPI.filterFiles(files, function(file, info) {
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

                        FileAPI.avatar = file; 
                        
                        FileAPI.Image(file).preview(170).get(function(err, img) {           
                            $defaultImg.hide();
                            $preview.children('video').remove();
                            $preview.children('canvas').remove();
                            $preview.append(img); 
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
                    },

                    error: function(xhr, error_msg, error) {
                        console.log("...ERROR!\n" + xhr.status + " " + error_msg); 
                        regView.showMessage('error', 'Пользователь с таким email уже существует!');
                    }
                });

                this.$('.app-form')[0].reset();
            }
        }

    }); // RegistrationView

    return RegistrationView;
});
