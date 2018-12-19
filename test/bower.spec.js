'use strict';
describe('bower dependencies', () => {

	const helper = require('./helper');
	const module = require('../');
	const fs = require('fs');
	const path = require('path');

	const projectPath = path.resolve(__dirname, 'fixtures', 'fake-project');
	let report, expectedReport;

	beforeAll(done => {
		jasmine.addMatchers(helper.customMatchers);
		expectedReport = helper.getReport('bower-report.txt');
		module.generateReport({
			include: ['bower'],
			path: projectPath
		})
			.then(r => { report = r; })
			.then(done)
			.catch(err => { console.log(err); }); // eslint-disable-line no-console
	});

	it('should return a report object', () => {
		expect(report).toBeReport();
	});

	it('should include warnings', () => {
		expect(report.warnings).toEqual(['underscore module does not have a "license" property, inferring as MIT']);
	});

	it('should return the report', () => {
		expect(report.toString()).toBe(expectedReport);
	});

	describe('when there is a non-folder in the bower_components', () => {
		const filename = path.join(projectPath, 'bower_components', 'placeholder');

		beforeAll(() => {
			fs.closeSync(fs.openSync(filename, 'w'));
		});

		afterAll(() => {
			fs.unlinkSync(filename);
		});

		it('should ignore the non-folder', done => {
			module.generateReport({
				include: ['bower'],
				path: projectPath
			})
				.then(done)
				.catch(err => { console.log(err); }); // eslint-disable-line no-console
		});
	});

});
