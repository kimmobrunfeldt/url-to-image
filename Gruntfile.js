module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['*.js', 'test/**/*.js'],
        options: {
          globals: {
            jQuery: true,
            console: true,
            module: true
          }
        }
    },
    shell: {
      mocha: {
        options: {
          stdout: true
        },
        command: 'mocha'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('test', ['jshint', 'shell:mocha']);
  grunt.registerTask('publish', ['test', 'release']);

};
