require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        bootstrap: "lib/bootstrap",        
        fileAPI: "lib/file_api/FileAPI"
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
            // deps: ['jquery'],
            exports: 'FileAPI'
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
