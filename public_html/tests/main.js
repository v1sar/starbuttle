QUnit.config.autostart = false;

require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "../js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        promisepolly: "lib/promise.min"
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'promisepolly': {
            exports: 'Promise'
        }
    }
});

var tests = [
    'models/tests/player.test',
    'views/tests/main.test'
];

require(tests, function () {
    QUnit.load();
    QUnit.start();
});
