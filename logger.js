'use strict';

var _ = require('underscore');
var util = require('util');
var chalk = require('chalk');

module.exports = function() {
	function F(args) {
		return Logger.apply(this, args);
	}

	F.prototype = Logger.prototype;

	return new F(arguments);
};

module.exports.Logger = Logger;

var methodsHash = {
	log: chalk.reset,
	info: chalk.cyan,
	warn: chalk.yellow,
	error: chalk.red
};

function Logger(name, options) {
	this.name = name;
	this.options = _({dateTime: true}).extend(options);
	this._times = {};
}

Logger.prototype._colorizeArgs = function(argsColorFn, args) {
	return argsColorFn.call(chalk, util.format.apply(util, args));
};

Logger.prototype._formatArgs = function(argsColorFn, args) {
	var parts = [];

	if (this.options.dateTime) {
		parts.push(chalk.gray('[' + new Date().toUTCString() + ']'));
	}

	parts = parts.concat([
		chalk.green('[' + this.name + ']'),
		this._colorizeArgs(argsColorFn, args)
	]);

	return parts.join(' ');
};

_(methodsHash).each(function(colorFn, method) {
	Logger.prototype[method] = function() {
		console[method].call(console, this._formatArgs(colorFn, arguments));
	};
});

// Logger.prototype.trace = function() {
// 	var stack = _((new Error()).stack.split('\n')).rest(2).join('\n');
// 	var msg = 'Trace';
// 	if (arguments.length) {
// 		msg += ': ' + util.format.apply(util, arguments);
// 	}
// 	msg += '\n' + stack;
// 	console.log(this._formatArgs(chalk.red, [msg]));
// };

// Logger.prototype.dir = function() {
// 	this.log(util.inspect.apply(util, arguments));
// };
//
// Logger.prototype.time = function() {
// 	this._times[util.format.apply(util, arguments)] = Date.now();
// };
//
// Logger.prototype.timeEnd = function() {
// 	var label = util.format.apply(util, arguments);
// 	var time = this._times[label];
// 	if (!time) return;
// 	this.log('%s: %dms', label, Date.now() - time);
// };
