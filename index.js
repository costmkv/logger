'use strict';

var util = require('util');
var chalk = require('chalk');

module.exports = function() {
	function F(args) {
		return Logger.apply(this, args);
	}

	F.prototype = Logger.prototype;

	return new F(arguments);
};

function Logger(name, options) {
	this.name = name;
	this.options = _({dateTime: true}).extend(options);
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

var methodsHash = {
	log: chalk.reset,
	info: chalk.cyan,
	warn: chalk.yellow,
	error: chalk.red
};

for (var method in methodsHash) {
	Logger.prototype[method] = function() {
		var formatArgs = this._formatArgs(methodsHash[method], arguments);
		console[method].call(console, formatArgs);
	};
}

module.exports.Logger = Logger;
