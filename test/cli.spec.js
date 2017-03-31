'use strict';
describe('CLI', () => {

	const spawn = require('child_process').spawn;

	let stdout, stderr;

	let callCli = function(args) {
		args = args || '';
		args = args.split(' ');
		return new Promise((resolve, reject) => {
			let cli = spawn('./cli.js', args);
			cli.stdout.on('data', data => {
				stdout += data;
			});
			cli.stderr.on('data', data => {
				stderr += data;
			});
			cli.on('close', code => {
				if (code > 0) { return reject(new Error(`cli.js returned error\n${stderr}`)); }
				resolve();
			});
		});
	};

	beforeEach(() => {
		stderr = '';
		stdout = '';
	});

	it('should print the usage info when "--help" is used', done => {
		callCli('--help').then(() => {
			expect(stdout).toMatch('Usage:');
		}).then(done);
	});

	it('should print the report to stdout', done => {
		callCli().then(() => {
			expect(stdout).toMatch('Dependency Licenses');
		}).then(done);
	});

	it('should print errors to stderr', done => {
		callCli('/nonexistent-path').then(() => {
			expect(stderr).toMatch('ERROR:');
		}).catch(() => done());
	});

	it('should print warnings to stderr', done => {
		callCli('./test/fixtures/fake-project --include bower').then(() => {
			expect(stderr).toMatch('WARNING: underscore module');
		}).then(done);
	});

	describe('path parameter', () => {

		it('should use the current directory when not specified', done => {
			callCli().then(() => {
				expect(stdout).toMatch(/\* minimist/);
			}).then(done);
		});

		it('should use the given path when specified', done => {
			callCli('./test/fixtures/fake-project').then(() => {
				expect(stdout).toMatch(/\* left-pad/);
			}).then(done);
		});

	});

	describe('--include option', () => {

		it('should return npm production deps when unspecified', done => {
			callCli().then(() => {
				expect(stdout).toMatch(/\* minimist/);
				expect(stdout).not.toMatch(/\* jasmine/);
			}).then(done);
		});

		it('should return npm development deps with "--include dev"', done => {
			callCli('--include dev').then(() => {
				expect(stdout).not.toMatch(/\* minimist/);
				expect(stdout).toMatch(/\* jasmine/);
			}).then(done);
		});

		it('should return all npm deps with "--include npm --include dev"', done => {
			callCli('--include npm --include dev').then(() => {
				expect(stdout).toMatch(/\* minimist/);
				expect(stdout).toMatch(/\* jasmine/);
			}).then(done);
		});

	});

});
