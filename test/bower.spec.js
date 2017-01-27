'use strict';
describe('bower dependencies', () => {

	const helper = require('./helper');
	const module = require('../');
	const path = require('path');

	let report, expectedReport;

	beforeAll(done => {
		jasmine.addMatchers(helper.customMatchers);
		expectedReport = helper.getReport('bower-report.txt');
		module.generateReport({
			include: ['bower'],
			path: path.resolve(__dirname, 'fixtures', 'fake-project')
		})
			.then(r => { report = r; })
			.then(done)
			.catch(err => { console.log(err); }); // eslint-disable-line no-console
	});

	it('should return a report object', () => {
		expect(report).toBeReport();
	});

	it('should have no warnings', () => {
		expect(report.warnings).toEqual([]);
	});

	it('should return the report', () => {
		expect(report.toString()).toBe(expectedReport);
	});

});
