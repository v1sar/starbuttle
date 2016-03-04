var express = require('express'),
    errorHandler = require('errorhandler'),
    app = express(),
	proxy = require('express-http-proxy');

var HOSTNAME = 'localhost',
    PORT = 8090,
    PUBLIC_DIR = __dirname + '/public_html';

var req_count = 0;

app.use(function (req, res, done) {
	var date = new Date();
	// Журналирование в формате [время] [номер запроса по счету]
  //test
	console.log("[%s] [%d]", date.toTimeString(), req_count++);
	done();
});

app
	.use('/', express.static(PUBLIC_DIR))
	.use(errorHandler());

app.listen(PORT, function () {
	console.log("Simple static server showing %s listening at http://%s:%s", PUBLIC_DIR, HOSTNAME, PORT);
});


app.use('/proxy', proxy('http://vk.com', {
	forwardPath: function(req, res) {
		console.log(1234);
		return require('url').parse(req.url).path;
	}
}));
