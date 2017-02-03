'use strict';

const _ = require('lodash');
const bowerLicenses = require('bower-license');
const fs = require('fs');
const nlf = require('nlf');
const path = require('path');

const templateFile = path.resolve(__dirname, 'template.txt');
const templateContents = fs.readFileSync(templateFile, 'utf8');

const defaultOpts = {
	context: {},
	include: ['npm'],
	path: process.cwd(),
	template: templateContents,
};

function Report() {
	this.licenses = [];
	this.generated = '';
	this.warnings = [];
}

Report.prototype.toString = function() {
	return this.generated;
};

Report.prototype.write = function(filename) {
	fs.writeFileSync(filename, this.generated);
};

// Resolve to an array of info for the bower dependencies
//   for the project at the given path.
// Passed options should match that of generateReport().
// Objects in the returned array include the properties:
//   * name: string
//   * description: string or undefined
//   * homepage: string or undefined
//   * licenses: array of strings
//   * version: string
function getBowerLicenses(opts) {
	let bowerDir = path.join(opts.path, 'bower_components');
	return new Promise((resolve, reject) => {
		bowerLicenses.init({ directory: bowerDir }, function(licenses, err) {
			if (err) { return reject(err); }
			let reformatted = Object.keys(licenses).map(key => {
				let data = licenses[key];
				let [unused, name, version] = key.match(/^(.*)@(.*)$/); // eslint-disable-line no-unused-vars
				data.name = name;
				data.licenses = data.licenses.map(license => {
					// Remove the "*" that is added to guesses.
					return license.replace(/\*$/, '');
				});
				data.version = version;
				return data;
			});
			resolve(reformatted);
		});
	});
}

// Resolve to an array of info for the npm dependencies
//   for the project at the given path.
// Passed options should match that of generateReport().
// Objects in the returned array include the properties:
//   * name: string
//   * description: string or undefined
//   * homepage: string or undefined
//   * licenses: array of strings
//   * version: string
function getNpmLicenses(opts) {
	let lookupLicenses = () => {
		let rootPkg;
		try {
			rootPkg = require(path.resolve(opts.path, 'package.json'));
		} catch (err) {
			return Promise.reject(err);
		}

		let getLicenses = () => {
			return new Promise((resolve, reject) => {
				nlf.find({
					directory: opts.path,
					depth: 0,
					production: !opts.include.includes('dev'),
					summaryMode: 'off'
				}, function(err, data) {
					if (err) { return reject(err); }
					resolve(data);
				});
			});
		};

		let isChildPackage = pkg => {
			return (
				(opts.include.includes('npm') && Object.keys(rootPkg.dependencies || {}).includes(pkg.name)) ||
				(opts.include.includes('dev') && Object.keys(rootPkg.devDependencies || {}).includes(pkg.name))
			);
		};

		let extractLicenses = pkg => {
			let thingsToTry = [
				pkg.licenseSources.package.summary.bind(pkg.licenseSources.package),
				pkg.licenseSources.license.summary.bind(pkg.licenseSources.license),
				pkg.licenseSources.readme.summary.bind(pkg.licenseSources.readme),
				function() { return ['Unknown']; }
			];
			let i = 0;
			pkg.licenses = [];
			while (pkg.licenses.length === 0) {
				pkg.licenses = thingsToTry[i]();
				i++;
			}
			return pkg;
		};

		return getLicenses().then(pkgs => {
			// nlf includes all top-level packages in node_modules
			// see https://github.com/iandotkelly/nlf/issues/30
			return pkgs.filter(isChildPackage);
		}).then(pkgs => {
			return pkgs.map(extractLicenses);
		});
	};

	let includePackageInfo = info => {
		let pkgInfo = require(path.resolve(info.directory, 'package.json'));
		return Object.assign({}, info, pkgInfo);
	};

	return lookupLicenses().then(pkgs => {
		return pkgs.map(includePackageInfo);
	});
}

// Returns a Promise that resolves with a Report object.
// Options:
//   * include -- Array of "npm" and/or "dev".
//   * path -- The root path of the project.
function generateReport(opts) {
	opts = Object.assign({}, defaultOpts, opts);

	let collectors = [];
	if (opts.include.includes('npm') || opts.include.includes('dev')) {
		collectors.push(getNpmLicenses(opts));
	}
	if (opts.include.includes('bower')) {
		collectors.push(getBowerLicenses(opts));
	}

	return Promise.all(collectors).then(results => {
		// Combine the results from all the collectors.
		return Array.prototype.concat.apply([], results);
	}).then(licenses => {
		// Sort the licenses by name.
		licenses.sort((a, b) => {
			if (a.name < b.name) { return -1; }
			if (a.name > b.name) { return 1; }
			return 0;
		});
		return licenses;
	}).then(licenses => {
		// Create the report.
		let report = new Report();
		let compiledTemplate = _.template(opts.template);
		let context = Object.assign({}, opts.context, { licenses: licenses });
		report.generated = compiledTemplate(context);
		return report;
	});
}

exports.generateReport = generateReport;
