'use strict';
describe('"context" option', () => {

	const module = require('../');
	const fs = require('fs');
	const path = require('path');

	let report, context;

	let templateFilename = path.resolve(__dirname, 'fixtures', 'alternate-template.txt');
	let template = fs.readFileSync(templateFilename, 'utf8');

	beforeAll(done => {
		context = {
			licenses: [], // won't be used
			testScalar: 'scalar',
			testObj: {
				foo: 'obj'
			}
		};
		module.generateReport({ context, template })
			.then(r => { report = r; })
			.then(done)
			.catch(err => { console.log(err); }); // eslint-disable-line no-console
	});

	it('should be included when generating the template', () => {
		expect(report.toString()).toMatch('Test scalar: scalar');
		expect(report.toString()).toMatch('Test object: obj');
	});

	it('should not replace the existing licenses', () => {
		expect(report.toString()).toMatch('minimist');
	});

});
