#!/usr/bin/env node
'use strict';

const fs = require('fs');
const generateReport = require('./').generateReport;
const path = require('path');

const scriptName = path.basename(process.argv[1]);
const startOfArgs = 2;
const knownArgs = [
	'_', 'help', 'include', 'template'
];
const args = require('minimist')(process.argv.slice(startOfArgs));

// Display usage info if --help is specified.
const usageStatement = `Generates a license report to stdout.
Usage:
  ${scriptName} [ROOTPATH] [--include npm] [--include dev] [--include bower]
                [--template FILE] [--CONTEXT VALUE --CONTEXT VALUE ...]
Options:
  ROOTPATH                Base path of the project
  --include               Dependencies to include ("npm", "dev", "bower")
  --template FILE         File to use as the template
  --CONTEXT VALUE         Additional context values (simple values or JSON strings)
                          to pass to the template
`;
if (args.help) {
	process.stdout.write(usageStatement);
	process.exit();
}

// Helper function to get and format arguments for the template context.
let getExtraArgs = args => {
	let formattedArgs = {};
	for (let prop in args) {
		if (args.hasOwnProperty(prop) &&
			!knownArgs.includes(prop) &&
			typeof args[prop] === 'string') {
			try {
				let val = JSON.parse(args[prop]);
				formattedArgs[prop] = val;
			} catch (err) {
				formattedArgs[prop] = args[prop];
			}
		}
	}
	return formattedArgs;
};

// Create the configuration.
let opts = {
	context: getExtraArgs(args),
	include: args.include || ['npm'],
	path: args._[0] || process.cwd()
};
if (args.template) {
	let contents = fs.readFileSync(args.template, 'utf8');
	opts.template = contents;
}

// Generate the report and output it to stdout.
generateReport(opts).then(report => {
	report.warnings.forEach(message => {
		process.stderr.write(`WARNING: ${message}\n`);
	});
	process.stdout.write(report.toString());
}).catch(err => {
	process.stderr.write(err.stack);
	process.exit(1);
});
