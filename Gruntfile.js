module.exports = function (grunt) {

    grunt.initConfig({
        clean: {
            all: ['build']
        },
        jshint: {
            core: {
                src: 'src/**/*.js'
            }
        },
        uglify: {
            core: {
                expand: true,
                cwd: 'src',
                src: '**/*.js',
                dest: 'build/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['clean', 'jshint', 'uglify']);
};