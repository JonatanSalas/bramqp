'use strict';
var vows = require('vows');
var assert = require('assert');
var tls = require('tls');
var fs = require('fs');
var async = require('async');
var bramqp = require('../lib/bramqp');
var puts = require('vows').console.puts({
	stream: process.stdout
});
vows.describe('tls').addBatch({
	'A tls socket': {
		topic: function() {
			var socket = tls.connect({
				host: 'localhost',
				port: 5671,
				key: fs.readFileSync('/etc/rabbitmq/certs/client/key.pem'),
				cert: fs.readFileSync('/etc/rabbitmq/certs/client/cert.pem'),
				ca: [fs.readFileSync('/etc/rabbitmq/certs/testca/cacert.pem')]
			});
			socket.on('error', function(a) {
				process.stderr.write(require('util').inspect(a));
			});
			return socket;
		},
		'used to initialize an AMQP connection': {
			topic: function(socket) {
				var self = this;
				bramqp.initialize(socket, 'rabbitmq/full/amqp0-9-1.stripped.extended', function(error, handle) {
					if (error) {
						return self.callback(error);
					}
					async.series([function(seriesCallback) {
						handle.openAMQPCommunication(seriesCallback);
					}, function(seriesCallback) {
						handle.closeAMQPCommunication(function(error) {
							handle.socket.end();
							seriesCallback(error);
						});
					}], function(error) {
						self.callback(error, handle);
					});
				});
			},
			'should connect': function(handle) {
				assert(handle);
			}
		}
	}
}).export(module);
