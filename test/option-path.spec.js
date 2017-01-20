'use strict';
describe('"path" option', () => {

	const helper = require('./helper');
	const module = require('../');
	const path = require('path');

	let report, expectedReport;

	beforeAll(done => {
		expectedReport = helper.getReport('fake-project-report.txt');
		module.generateReport({ path: path.resolve(__dirname, 'fixtures', 'fake-project') })
			.then(r => { report = r; })
			.then(done)
			.catch(err => { console.log(err); }); // eslint-disable-line no-console
	});

	it('should use that for the root path', () => {
		expect(report.toString()).toBe(expectedReport);
	});

});
