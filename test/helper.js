'use strict';

const fs = require('fs');
const path = require('path');

// Retrieves the contents of a file in test/fixtures.
let getFixture = (filename) => {
	filename = path.resolve(__dirname, 'fixtures', filename);
	return fs.readFileSync(filename, 'utf8');
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
exports.getFixture = getFixture;
