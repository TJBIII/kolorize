// Karma configuration
// Generated on Fri Apr 01 2016 14:43:00 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'lib/bower_components/jquery/dist/jquery.js',
      'lib/bower_components/jquery-ui/jquery-ui.js',
      'lib/bower_components/angular/angular.js',
      'lib/bower_components/angular-route/angular-route.js',
      'lib/bower_components/angular-ui-sortable/sortable.js',
      'lib/bower_components/firebase/firebase.js',
      'lib/bower_components/angularfire/dist/angularfire.js',
      'lib/node_modules/angular-mocks/angular-mocks.js',
      'lib/node_modules/angular-clipboard/angular-clipboard.js',
      'lib/bower_components/angular-deckgrid/angular-deckgrid.js',
      'app/**/*.js',
      'test/**/*Spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
