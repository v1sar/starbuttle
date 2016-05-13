define(function (require) {
    QUnit.module("views/");

    /* TODO: Promise error
    QUnit.test("Render MainView is right (check $el)", function () {
        var MainView = require('views/main'),
            main = new MainView();

        var mainHeader = '<h1 class="header__h1 header__h1_80">STAR BUTTLE</h1>';
        
        QUnit.equal(main.id, 'main', 'ID MainView is right!');
        QUnit.equal(main.tagName, 'div', 'TAG MainView is right!');

        QUnit.notEqual(main.$el.find('.header').html(), mainHeader, 'No header! (before render)');
        main.render();
        QUnit.equal(main.$el.find('.header').html(), mainHeader, 'Header there is! Content is correct! (after render)');
    });
    */

    /*
    QUnit.test("AppView correctly shows and hides views", function () {
    	$('body').append('<div id="page"></div>');
    	
    	var app = require('views/app'),
    		$page = $('#page');
    	
    	app.setElement(page);
	    app.setViews({
	        'main': require('views/main'),
	        'signIn': require('views/sign-in')
	    });

	    app.getView('main').show();
	    app.getView('signIn').show();

        var $main = app.$el.find('#main'),
        	$signin = app.$el.find('#sign-in'),
        	$game = app.$el.find('#game');

        QUnit.equal($game.get(0), undefined, $game + 'No the gameView in DOM');
        QUnit.equal($main.is(':visible'), false, 'The mainView is hidden');
        QUnit.equal($signin.is(':visible'), true, 'The signinView is visible!');
    });
    */
});
