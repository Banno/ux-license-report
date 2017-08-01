'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

// Retrieves the contents of a file in test/fixtures.
let getReport = (filename) => {
	filename = path.resolve(__dirname, 'fixtures', 'reports', filename);
	let compiledTemplate = _.template(fs.readFileSync(filename, 'utf8'));
	let basePath = path.resolve(__dirname, '..', 'node_modules');
	let pkgInfo = {};
	let files = fs.readdirSync(basePath);
	files.forEach(file => {
		let stats = fs.statSync(path.resolve(basePath, file));
		if (stats.isDirectory()) {
			try {
				pkgInfo[path.basename(file)] = require(path.resolve(basePath, file, 'package.json'));
			} catch (err) {}
		}
	});
	return compiledTemplate({ pkgs: pkgInfo });
};

// Yarn and npm generate different package.json for installed packages.
// This normalizes the generated report (string) so that it matches
//   the expected output from an `npm install`.
let normalizeReport = report => {
	// npm creates a "homepage" property for "bower-license", but yarn does not.
	let homepageLine = '  URL: https://github.com/AceMetrix/bower-license#readme\n';
	return report.replace(/(bower-license\n)( {2}Version:)/, `$1${homepageLine}$2`);
};

// Custom Jasmine matchers to check if the value is a Report object.
let toBeReport = (util, customEqualityTesters) => {
	return {
		compare: (actual) => {
			let result = { pass: true };
			if (!actual) {
				result.pass = false;
			} else {
				if (!(actual.toString instanceof Function)) { result.pass = false; }
				if (!(actual.warnings instanceof Array)) { result.pass = false; }
				if (!(actual.write instanceof Function)) { result.pass = false; }
			}
			if (result.pass) {
				result.message = 'Expected ' + JSON.stringify(actual) + ' to not be a report object';
			} else {
				result.message = 'Expected ' + JSON.stringify(actual) + ' to be a report object';
			}
			return result;
		}
	};
};

exports.customMatchers = {
	toBeReport: toBeReport
};
exports.getReport = getReport;
exports.normalizeReport = normalizeReport;
