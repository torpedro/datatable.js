module.exports = function(grunt) {

    grunt.initConfig({
        config: {
            'srcdir': './src/',
            'builddir': './build/'
        },

        watch: {
            options: {
                livereload: true
            },
            typescript: {
                files: ['<%= config.srcdir %>/**/*.ts'],
                tasks: ['copy:build', 'typescript:build']
            }
        },

        clean: {
            build: {
                files: [{
                    dot: true,
                    src: '<%= config.builddir %>/*'
                }]
            }
        },
		
		
        copy: {
            build: {
				// Copy all files to the build-directory
                files: [{
                    dot: true,
                    expand: true,
                    cwd: '<%= config.srcdir %>/',
                    src: ['**/*'],
                    dest: '<%= config.builddir %>/'
                }]
            },
		},
		
		
        // Compile the Typescript files to JavaScript
        typescript: {
            options: {
                sourceMap: true
            },
            build: {
                src: ['<%= config.builddir %>/**/*.ts']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('build', [
        'clean:build',
        'copy:build',
        'typescript:build'
    ]);

    grunt.registerTask('default', ['build'])
};