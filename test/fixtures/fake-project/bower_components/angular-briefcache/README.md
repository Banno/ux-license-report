# angular-briefcache

Cache factory for Angular with short expirations. Designed for preventing duplication of HTTP requests caused by rapid-fire processes, such as running through routing states.

## Usage

Use it anywhere you would use Angular's `$cacheFactory`:

```javascript
angular.module('myApp', ['banno.briefCache']).service('ExampleService', function($http, briefCache) {
  return {
    find: function() {
      return $http.get('/api/example', { cache: briefCache });
    }
  };
});
```

## Installation

The briefCache requires Angular and the [angular-cache](https://github.com/jmdobry/angular-cache) library. These are installed automatically when using npm:

```shell
`npm install --save angular-briefcache`
```

Then include the necessary scripts in your app:

```html
<html ng-app="myApp">
  <head>
    <title>Example</title>
    <script src="node_modules/angular/angular.js"></script>
    <script src="node_modules/angular-cache/dist/angular-cache.js"></script>
    <script src="node_modules/angular-briefcache/dist/angular-briefcache.js"></script>
    <script>
      angular.module('myApp', ['banno.briefCache']).run(function(briefCache) {
        console.log('briefCache info:', briefCache.info());
      });
    </script>
  </head>
  <body>Example</body>
</html>
```

You can also use RequireJS to load the modules:

```html
<html ng-app="myApp">
  <head>
    <title>Example using RequireJS</title>
    <script src="node_modules/requirejs/require.js"></script>
    <script>
      requirejs.config({
        shim: {
          angular: {
            exports: 'angular'
          }
        },
        paths: {
          'angular': 'node_modules/angular/angular',
          'angular-cache': 'node_modules/angular-cache/dist/angular-cache',
          'banno/briefCache': 'node_modules/angular-briefcache/dist/angular-briefcache'
        }
      });

      require(['angular', 'banno/briefCache'], function(angular, briefCache) {
        angular.module('myApp', [briefCache]).run(function(briefCache) {
          console.log('briefCache info:', briefCache.info());
        });
      });
    </script>
  </head>
  <body>Example</body>
</html>
```

## Configuration

This cache factory comes with the following settings:

* Each item has a maximum age of 10 seconds.
* Expired items are deleted as they are requested ("passive" removal).
* The entire cache is completely cleared every hour.

These settings can be changed in the briefCacheProvider (prior to Angular bootstrap) or briefCache:

```javascript
briefCacheProvider.setMaxAge(8 * 1000); // 8 seconds
briefCacheProvider.setCacheFlushInterval(24 * 60 * 60 * 1000); // flush the cache every 24 hours
briefCacheProvider.setDeleteOnExpire('aggressive'); // search for and deleted expired items

briefCache.setMaxAge(8 * 1000);
briefCache.setCacheFlushInterval(null); // disables clearing of the entire cache periodically
briefCache.setDeleteOnExpire('passive'); // use passive removed (the default)
```

You can disable (or re-enable) the cache prior to Angular bootstrap:

```javascript
briefCacheProvider.disable();
```

You can also enable and disable the cache on the fly:

```javascript
briefCache.disable();
briefCache.enable();
console.log('Is briefCache disabled?', briefCache.info().disabled);
```

## Contributing

You'll need [gulp](http://gulpjs.com/) installed on your machine to run the development tools. Then run `gulp` to run all of the tasks and watch the files for changes.

Please add tests and maintain the existing styling when adding and updating the code.

## Bugs & Feature Requests

Have an issue or feature request? Please [open a new issue](https://github.com/Banno/angular-briefcache/issues/new).

## License

Copyright 2015 [Jack Henry & Associates Inc](https://www.jackhenry.com/).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
