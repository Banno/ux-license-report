'use strict';
describe('default options', () => {

	const { customMatchers, getReport, normalizeReport } = require('./helper');
	const module = require('../');
	const fs = require('fs');
	const tempfile = require('tempfile');

	let report, expectedReport;

	beforeAll(done => {
		jasmine.addMatchers(customMatchers);
		expectedReport = getReport('default-report.txt');
		module.generateReport()
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

	it('toString() should return the report', () => {
		expect(normalizeReport(report.toString())).toBe(expectedReport);
	});

	describe('write()', () => {

		let outFile;

		beforeEach(() => { outFile = tempfile(); });
		afterEach(() => { fs.unlinkSync(outFile); });

		it('should save the report', () => {
			report.write(outFile);
			expect(normalizeReport(fs.readFileSync(outFile, 'utf8'))).toBe(expectedReport);
		});

	});

});
