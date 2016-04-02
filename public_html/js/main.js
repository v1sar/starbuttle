require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        bootstrap: "lib/bootstrap",        
        fileAPI: "lib/file_api/FileAPI",
        three: "lib/3D/three",
        three_world: "lib/3D/world", 
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'fileAPI': {
            exports: 'FileAPI'
        },
        'three': {
            exports: 'THREE'
        },
        'three_world': {
            deps: ['three'],
            exports: 'World'
        }
    }
});

require([
    'backbone',
	'router',
    'bootstrap'
], function(
	Backbone,
	router
) {

    Backbone.history.start();

});
