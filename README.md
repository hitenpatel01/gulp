#Common gulp tasks for Typescript/Angular applications
- Compile Typescript files
  * seperate tasks for source and unit test files
  * bundle compiled files into single output file
  * produce sourcemaps
  * minified as well as unminified output files
  * commented output files for istanbul to ignore Typescript `__extends` IIFE to improve code coverage
- Static code analysis (linting) of Typescript files
- Download Typescript definition files from DefinitelyTyped.org
- Combine and minify CSS files
- Run Karma
- Clean output files

##Configuring a project
> Configuration files listed below can be updated directly from your IDE as it may support intelliSense however using npm packages could sometimes be easier ex: `tsd install <...pattern> --save` command takes care of commit hash which otherwise needs to be known while adding packages directly in tsd.json   

- Download files from this repository and add them to your project
- Update `.bowerrc` to specify directory for front-end packages. Default is `./lib`
- Update `bower.json` to add front-end packages required for your project and run `bower install` to download them
- Update `package.jsonn` to add node packages required for your project and run `npm install` to download them
- Update `tsd.json` to specify location for type definitions, default is `./type-definitions`. Add type definitions required for your project and run `gulp type-definitions` to download them
- Update `tsProjectSrc` and `tsProjectSpec` in `gulpfile.js` to specify Typescript compiler options for your source and unit test files
- Update `paths.webroot` and `paths.output` to specify location of your root of your source files and output folder (an exclusive folder rather than root is recommended for easier exclusion during checkins)
- Update location of files in `paths` according to your project structure
- Update `tslint.json` to customize code standards followed by your team
- Update `karma.conf.js` especially `files: [...]` to include front-end libraries used in your project
 
##Tasks
- `clean:css` deletes app.css and app.min.css files from output folder 
- `clean:src` deletes app.js, app.js.map, app.min.js and app.min.js.map files from output folder
- `clean:spec` deletes specs.js from output folder
- `clean` run above three tasks asynchronously
- `type-definitions` downloads/updates Typescript type definition files
- `tslint` pereforms static code analyis on source and unit test files written in .ts
- `src` compiles source .ts files to produce app.js, app.js.map, app.min.js and app.min.js.map files. Runs `clean:src` & `tslint` before compiling the files
- `spec` compiles unit test .ts files to produce specs.js file. Runs `clean:spec` & `tslint` before compiling the files
- `css` bundles .css files to produce app.css and app.min.css. Runs `clean:css` before bunding the files
- `test:single` invokes Karma to run unit tests and produce code coverage using istanbul. Change `singleRun` value to false to run the unit tests whenever any source file changes.
- `default` runs `src`, `spec` and `css` asynchronously
