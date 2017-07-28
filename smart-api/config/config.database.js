var mongoose = require('mongoose');


module.exports  = function(){
	mongoose.connect('mongodb://localhost/reciclopac');

	mongoose.connection.on('connected', function () {
		console.log('Mongoose default connection open to ');
	});

	mongoose.connection.on('error',function (err) {
		console.log('Mongoose default connection error: ' + err);
	});

	mongoose.connection.on('disconnected', function () {
		console.log('Mongoose default connection disconnected');
	});

	mongoose.connection.on('openUri', function () {
		console.log('Mongoose default connection is open');
	});
}