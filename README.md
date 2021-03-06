# License Report

> Generates license reports of 3rd-party software dependencies

Looks through a project's npm `dependencies` (and optionally `devDependencies` and Bower `dependencies`), pulls out licensing information, and compiles it into a given template.

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

* `context`: Object of values (indexed by property) to add to the template. Default is `{}`.
* `include`: Array of `npm` (for package.json `dependencies`), `dev` (for package.json `devDependencies`), and/or `bower` (for bower.json `dependencies`). Default is `['npm']`.
* `path`: The root path of the project.
* `template`: [Lodash template](https://lodash.com/docs/4.17.4#template) string to use when rendering. Default is in [`template.txt`](https://github.com/Banno/ux-license-report/blob/master/template.txt).

The returned report object has the following properties:

* `toString()`: Returns the compiled report.
* `warnings`: An array of any warnings that occurred.
* `write(filename)`: Saves the compiled report to a file.

## CLI

If you have this module installed globally or inside another project, you can call it on the command line from the `generate-license-report.js` script:

```
$ ./generate-license-report.js [ROOTPATH]
     [--include npm] [--include dev] [--include bower]
     [--template FILE]
     [--CONTEXT VALUE --CONTEXT VALUE ...]
     > licenses.txt
```

If the root path is not specified, the current working directory is used. The default values for other options are the same as the API.

All options are passed through to the template, so you can add to the context by passing scalar values or JSON strings. For example: `./generate-license-report.js --foo 1 --bar '{"bar": "value"}'`.

The generated report sent to standard output (`stdout`), so you can save it by redirecting it to a file (as shown in the example above). Any errors or warnings are sent to standard error (`stderr`).

Call the script with the `--help` option (`./generate-license-report.js --help`) to see the usage info.

## Contributing

Please add tests and maintain the existing styling when adding and updating the code.

```
yarn lint  # run linting
yarn test  # run tests
```

## Bugs & Feature Requests

Have an issue or feature request? Please [open a new issue](https://github.com/Banno/ux-license-report/issues/new).

## License

Copyright 2017 [Jack Henry & Associates Inc](https://www.jackhenry.com/).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
