'use strict';
describe('"include" option', () => {

	const { getReport, normalizeReport } = require('./helper');
	const module = require('../');
	const path = require('path');

	let report, expectedReport;

	describe('as ["dev"]', () => {

		beforeAll(done => {
			expectedReport = getReport('dev-report.txt');
			module.generateReport({ include: ['dev'] })
				.then(r => { report = r; })
				.then(done)
				.catch(err => { console.log(err); }); // eslint-disable-line no-console
		});

		it('should only include dev deps', () => {
			expect(normalizeReport(report.toString())).toBe(expectedReport);
		});

		it('should not throw an error if "devDependencies" is not defined', done => {
			let hadError;
			module.generateReport({
				include: ['dev'],
				path: path.resolve(__dirname, 'fixtures', 'fake-project')
			}).then(() => {
				hadError = false;
			}).catch(() => {
				hadError = true;
			}).then(() => {
				expect(hadError).toBe(false);
			}).then(done);
		});

	});

	describe('as ["npm"]', () => {

		beforeAll(done => {
			expectedReport = getReport('default-report.txt');
			module.generateReport({ include: ['npm'] })
				.then(r => { report = r; })
				.then(done)
				.catch(err => { console.log(err); }); // eslint-disable-line no-console
		});

		it('should only include production deps', () => {
			expect(normalizeReport(report.toString())).toBe(expectedReport);
		});

	});

	describe('as ["dev", "npm"]', () => {

		beforeAll(done => {
			expectedReport = getReport('all-deps-report.txt');
			module.generateReport({ include: ['dev', 'npm'] })
				.then(r => { report = r; })
				.then(done)
				.catch(err => { console.log(err); }); // eslint-disable-line no-console
		});

		it('should include all deps', () => {
			expect(normalizeReport(report.toString())).toBe(expectedReport);
		});

	});

});
