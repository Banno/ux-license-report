# License Report

> Generates license reports of 3rd-party software dependencies

Looks through a project's npm `dependencies` (and optionally `devDependencies`), pulls out licensing information, and compiles it into a given template.

```javascript
const licenser = require('ux-license-report');

let report = licenser.generateReport();
console.log(report.toString()); // print it to the console
report.write('report.txt'); // saves the report to a file
```

## API

### `generateReport(opts)`

Returns a Promise that resolves to the generated report.

Options:

* `include`: Array of `npm` (for package.json `dependencies`), and/or `dev` (for package.json `devDependencies`). Default is `['npm']`.
* `path`: The root path of the project.

The returned report object has the following properties:

* `toString()`: Returns the compiled report.
* `warnings`: An array of any warnings that occurred.
* `write(filename)`: Saves the compiled report to a file.

## CLI

If you have this module installed globally or inside another project, you can call it on the command line from the `generate-license-report.js` script:

```
$ ./generate-license-report.js [rootPath] [--include npm] [--include dev] > licenses.txt
```

If the root path is not specified, the current working directory is used. The default `--include` value is `npm`.

The generated report sent to standard output (`stdout`), so you can save it by redirecting it to a file (as shown in the example above). Any errors or warnings are sent to standard error (`stderr`).

Call the script with the `--help` option (`./generate-license-report.js --help`) to see the usage info.

## Contributing

Please add tests and maintain the existing styling when adding and updating the code.

```
npm run lint  # run linting
npm test      # run tests
```

## Bugs & Feature Requests

Have an issue or feature request? Please [open a new issue](https://github.com/Banno/ux-license-report/issues/new).

## License

Copyright 2017 [Jack Henry & Associates Inc](https://www.jackhenry.com/).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
