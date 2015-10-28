module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    release: {
      options: {
        // Don't release to NPM since travis does this
        npm: false,
        npmtag: false,
        // default: 'release <%= version %>'
        commitMessage: 'Release <%= version %>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-release');
};
