module.exports = function(grunt) {

    grunt.initConfig({
        cfg: {
            'libName': 'datasci.js',
            'libNamespace': 'sci',
             
            'src': './src',
            'test': './test',
            'build': './build',
            'bower': './bower_components',
        },

        watch: {
            options: {
                livereload: true
            },
            src: {
                files: [
                    '<%= cfg.src %>/**/*.ts',
                    '<%= cfg.src %>/**/*.js'
                ],
                tasks: ['build', 'only-test']
            },
            test: {
                files: [
                    '<%= cfg.test %>/**/*.ts',
                    '<%= cfg.test %>/**/*.js'
                ],
                tasks: ['only-test']
            }
        },

        clean: {
            build: {
                files: [{
                    dot: true,
                    src: '<%= cfg.build %>/*'
                }]
            }
        },
		
		
        copy: {
            bower: {
                // Copy all bower files
                files: [{
                    dot: true,
                    expand: true,
                    cwd: '<%= cfg.bower %>/',
                    src: ['**/*'],
                    dest: '<%= cfg.build %>/bower_components/'
                }]    
            },
            
            
            src: {
				// Copy all src files to the build-directory
                files: [{
                    dot: true,
                    expand: true,
                    cwd: '<%= cfg.src %>/',
                    src: ['**/*'],
                    dest: '<%= cfg.build %>/src/'
                }]
            },
            
            test: {
				// Copy all test files to the build-directory
                files: [{
                    dot: true,
                    expand: true,
                    cwd: '<%= cfg.test %>/',
                    src: ['**/*'],
                    dest: '<%= cfg.build %>/test/'
                }]
            },

            release: {
                files: [{
                    src: "build/datasci.js-full.js",
                    dest: "datasci.js"
                }]
            }
		},
		
		
        // Compile the Typescript files to JavaScript
        ts: {
            options: {
                compiler: "node_modules/typescript/bin/tsc",
        		module: 'commonjs',
                failOnTypeErrors: true,
                fast: "watch"
            },
            src: {
                options: {
                    declaration: true
                },
                src: ['<%= cfg.build %>/src/**/*\.ts']
            },
            test: {
                src: ['<%= cfg.build %>/test/**/*.ts']
            }
        },
        
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: false
                },
                src: ['<%= cfg.build %>/test/**/*.js']
            }
        },
        
        // Browserify for web release
        browserify: {
            options: {
                browserifyOptions: {
                    standalone: '<%= cfg.libNamespace %>'      
                }
            },
            src: {
                src: '<%= cfg.build %>/src/app.js',
                dest: '<%= cfg.build %>/<%= cfg.libName %>-full.js'
            }
        },
        
        // Uglify for release
        uglify: {
            browser: {
                files: {
                    '<%= cfg.build %>/<%= cfg.libName %>-full-min.js': ['<%= cfg.build %>/<%= cfg.libName %>-full.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('build', [
        'clean:build',
        'copy:src',
        'ts:src',
        'browserify'
    ]);
    
    grunt.registerTask('only-test', [
        'copy:test',
        'ts:test',
        'mochaTest'
    ]);
    
    // Build and Test
    grunt.registerTask('test', [
        'build',
        'only-test'
    ]);
    
    // Build, Test and Minify
    grunt.registerTask('release', [
        'build',
        'only-test',
        'uglify:browser',
        'copy:release'
    ]);

    grunt.registerTask('default', ['test']);
};