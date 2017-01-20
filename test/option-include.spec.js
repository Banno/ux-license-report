'use strict';
describe('"include" option', () => {

	const helper = require('./helper');
	const module = require('../');

	let report, expectedReport;

	describe('as ["dev"]', () => {

		beforeAll(done => {
			expectedReport = helper.getFixture('dev-report.txt');
			module.generateReport({ include: ['dev'] })
				.then(r => { report = r; })
				.then(done)
				.catch(err => { console.log(err); }); // eslint-disable-line no-console
		});

		it('should only include dev deps', () => {
			expect(report.toString()).toBe(expectedReport);
		});

	});

	describe('as ["npm"]', () => {

		beforeAll(done => {
			expectedReport = helper.getFixture('default-report.txt');
			module.generateReport({ include: ['npm'] })
				.then(r => { report = r; })
				.then(done)
				.catch(err => { console.log(err); }); // eslint-disable-line no-console
		});

		it('should only include production deps', () => {
			expect(report.toString()).toBe(expectedReport);
		});

	});

	describe('as ["dev", "npm"]', () => {

		beforeAll(done => {
			expectedReport = helper.getFixture('all-deps-report.txt');
			module.generateReport({ include: ['dev', 'npm'] })
				.then(r => { report = r; })
				.then(done)
				.catch(err => { console.log(err); }); // eslint-disable-line no-console
		});

		it('should include all deps', () => {
			expect(report.toString()).toBe(expectedReport);
		});

	});

});
