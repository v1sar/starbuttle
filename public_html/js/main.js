require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        bootstrap: "lib/bootstrap",        
        fileAPI: "lib/file_api/FileAPI",
        promisepolly: "lib/promise.min",
        // 3D - world
        three: "lib/3D/three.min", 
        flycontrols: "lib/3D/flycontrols",
        ddsloader: "lib/3D/ddsloader",
        mtlloader: "lib/3D/mtlloader",
        objloader: "lib/3D/objloader",
        objmtlloader: "lib/3D/objmtlloader"
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
        'promisepolly': {
            exports: 'Promise'
        },
        // 3D - world
        'three': {
            exports: 'THREE'
        },
        'flycontrols': { 
            deps: ['three']
        },
        'ddsloader': {
            deps: ['three'],
            exports: 'DDSLoader'
        },
        'mtlloader': {
            deps: ['three'],
            exports: 'MTLLoader'
        },
        'objloader': {
            deps: ['three'],
            exports: 'OBJLoader'
        },
        'objmtlloader': {
            deps: ['three', 'ddsloader', 'mtlloader', 'objloader'],
            exports: 'OBJMTLLoader'
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
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceWorker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    }
        
    Backbone.history.start();
});
