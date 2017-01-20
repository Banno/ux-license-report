'use strict';

const _ = require('lodash');
const fs = require('fs');
const nlf = require('nlf');
const path = require('path');

const templateFile = path.resolve(__dirname, 'template.txt');

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

// Returns an array of info for the npm dependencies for
//   the project at the given path.
// Objects in the returned array include the properties:
//   * name: string
//   * description: string or undefined
//   * homepage: string or undefined
//   * licenses: array of strings
//   * version: string
function getNpmLicenses(rootPath) {
	let lookupLicenses = () => {
		let rootPkg = require(path.resolve(rootPath, 'package.json'));

		let getLicenses = () => {
			return new Promise((resolve, reject) => {
				nlf.find({
					directory: rootPath,
					depth: 0,
					production: true,
					summaryMode: 'off'
				}, function(err, data) {
					if (err) { return reject(err); }
					resolve(data);
				});
			});
		};

		let isChildPackage = pkg => {
			return Object.keys(rootPkg.dependencies).includes(pkg.name);
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
function generateReport() {
	return getNpmLicenses(process.cwd()).then(licenses => {
		let report = new Report();
		let template = fs.readFileSync(templateFile, 'utf8');
		let compiledTemplate = _.template(template);
		report.generated = compiledTemplate({ licenses: licenses });
		return report;
	});
}

exports.generateReport = generateReport;
