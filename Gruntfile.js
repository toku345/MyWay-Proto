//
// Gruntfile.js
//

module.exports = function(grunt) {
  grunt.initConfig({
    bower: {
      install: {
        options: {
          targetDir: './public/vendor',
          layout: 'byType',
          install: true,
          verbose: false,
          cleanTargetDir: true,
          cleanBowerDir: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
};
