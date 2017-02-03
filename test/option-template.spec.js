'use strict';
describe('"template" option', () => {

	const module = require('../');
	const fs = require('fs');
	const path = require('path');

	let report;

	let templateFilename = path.resolve(__dirname, 'fixtures', 'alternate-template.txt');
	let template = fs.readFileSync(templateFilename, 'utf8');

	beforeAll(done => {
		module.generateReport({ template })
			.then(r => { report = r; })
			.then(done)
			.catch(err => { console.log(err); }); // eslint-disable-line no-console
	});

	it('should use the alternate template', () => {
		expect(report.toString()).toMatch('This is an alternate template');
	});

});
