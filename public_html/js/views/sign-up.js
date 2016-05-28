window.FileAPI = {
    debug: false,  
    media: true,
    staticPath: '../lib/file_api/'
};   

define(function(require) {   
    var FileAPI = require('fileAPI');

    var Backbone = require('backbone');
        UserModel = require('models/user'),
        tmpl  = require('tmpl/sign-up');

    var RegistrationView = Backbone.View.extend({
        template: tmpl,

        id: 'sign-up',

        events: {
            'submit .js-sign-up-form': 'signup',
            'click .js-webcamera-btn': 'cameraPublish',
            'change .js-choose': 'fileUpload'
        },

        model: new UserModel(),

        initialize: function () {
            var view = this;

            this.listenTo(
                this.model, 
                'signUpSuccess',
                function() { view.successMsg(view.model.get('login')); }
            );

            this.listenTo(
                this.model, 
                'signUpError',
                function() { view.errorMsg(); }
            ); 

            this.listenTo(this.model, 'invalid', this.showErrors);
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
            this.hideErrors();  
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

        successMsg: function(login) {
            var text = 'You have successfully registered as',
                link = '/#signin',
                linkText = login;

            this.showMessage('success', text, link, linkText);
        },

        errorMsg: function() {
            var text = 'A user with such login or email already exists';
            this.showMessage('error', text);
        },

        hideErrors: function(model, errors) {
            this.$('.form-group').removeClass('has-error');
            this.$('.help-block').text('');

            this.$('.js-alert').hide();
        },

        showErrors: function(model, errors) {
            var $input = null;

            _.each(errors, function(message, inputName) {                
                $input = this.$('input[name="' + inputName + '"]');
                $input.parent().parent('.form-group').addClass('has-error');
                $input.next().text(message);
            }, this);
        },

        cameraPublish: function() {
            var $preview = this.$('.js-preview'),
                $webcameraBtn = this.$('.js-webcamera-btn'),
                $shotBtn = this.$('.js-shot-btn'),
                $fileUploadInput = this.$('.js-choose'),
                $defaultImg = this.$('.js-default-img');

            $defaultImg.hide();
            $webcameraBtn.hide();
            $shotBtn.show();

            var view = this;

            view.model.set({ avatar: null });

            FileAPI.Camera.publish($preview, { width: 170, height: 170 }, function (err, cam) {
                if (err) {
                    alert('WebCam or Flash not supported!');
                    
                    $preview.children('video').remove();
                    $preview.css('width','0').css('height','0');                      
                    $defaultImg.show();

                    $shotBtn.hide();
                    $webcameraBtn.show();

                    return;
                } 

                $shotBtn.on('click', function() {
                    if(cam.isActive()) {
                        var shot = cam.shot();

                        view.model.set({ avatar: shot.file });   // canvas

                        shot.preview(170).get(function (err, img){                            
                            $preview.children('video').remove();
                            $preview.children('canvas').remove();
                            $preview.append(img);
                        });
                        
                    } else {
                        alert('Web camera is turned off!');
                        
                        view.model.set({ avatar: null });

                        $preview.children('video').remove();
                        $preview.children('canvas').remove();                        
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
            var view = this,
                $preview = this.$('.js-preview'),                    
                $defaultImg = this.$('.js-default-img');
            
            view.model.set({ avatar: null });

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

                    view.model.set({ avatar: file }); 
                    
                    FileAPI.Image(file).preview(170).get(function(err, img) {           
                        $defaultImg.hide();
                        $preview.children('video').remove();
                        $preview.children('canvas').remove();
                        $preview.append(img); 
                    });
                }
            });
            
        },   // fileUploadInit
        
        signup: function(event) {                   
            event.preventDefault();

            var view = this;

            view.hideErrors();

            var $preview = this.$('.js-preview'),
                $webcameraBtn = this.$('.js-webcamera-btn'),
                $shotBtn = this.$('.js-shot-btn'),
                $defaultImg = this.$('.js-default-img');

            view.model.set({
                email: view.$('input[name="email"]').val(),
                password: view.$('input[name="password"]').val(),
                login: view.$('input[name="login"]').val()
            });
            
            if (view.model.isValid()) {
                avatar = view.model.get('avatar');
                
                if (avatar !== null) {
                    FileAPI.readAsDataURL(avatar, function(event) {
                        if (event.type == 'load') {
                            view.model.save({ avatar: event.result });             
                        } else if (event.type =='progress') {
                            console.log(event.loaded / event.total * 100 + '% avatar parsing to base64');
                        } else {
                            console.log('Avatar error parse to base64');
                        }
                    });              
                } else {
                    view.model.save();
                }

                this.$('.js-sign-up-form')[0].reset();

                $preview.children('video').remove();
                $preview.children('canvas').remove();   
                $preview.removeAttr('style');
                $shotBtn.hide();
                $webcameraBtn.show();

                $defaultImg.show();
            }   // isValid()
        }   // signup
    }); // RegistrationView

    return RegistrationView;
});
