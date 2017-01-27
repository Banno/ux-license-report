#!/usr/bin/env node
'use strict';

const generateReport = require('./').generateReport;
const path = require('path');

const scriptName = path.basename(process.argv[1]);
const startOfArgs = 2;
const args = require('minimist')(process.argv.slice(startOfArgs));

// Display usage info if --help is specified.
const usageStatement = `Generates a license report to stdout.
Usage:
  ${scriptName} [rootPath] [--include npm] [--include dev]
Options:
  rootPath                Base path of the project
  --include               Dependencies to include ("npm", "dev")
`;
if (args.help) {
	process.stdout.write(usageStatement);
	process.exit();
}

// Create the configuration.
let opts = {
	include: args.include || ['npm'],
	path: args._[0] || process.cwd()
};

// Generate the report and output it to stdout.
generateReport(opts).then(report => {
	process.stdout.write(report.toString());
}).catch(err => {
	process.stderr.write(`ERROR: ${err.message}\n`);
	process.exit(1);
});
