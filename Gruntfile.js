
function loadPlugins(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-continue');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-ts");
}

function registerTasks(grunt) {
    grunt.registerTask('lint', [
        "clean:reports",
        "tslint:all"
    ]);

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

    grunt.registerTask('test-and-lint', [
        'test',
        "continue:on", // --force for linting
        'lint',
        "continue:off", // unset --force
        'lint-test'
    ]);
    
    // Build, Test and Minify
    grunt.registerTask('release', [
        'build',
        'only-test',
        'uglify:browser',
        'copy:release'
    ]);

    grunt.registerTask('default', ['test']);


    grunt.registerTask('lint-test', 'Checks whether the amount of errors exceeds our limit.', function() {
        var errors = grunt.file.read("reports/tslint.txt").split("\n");
        var numErrors = errors.length - 1;
        var errorLimit = 506;

        if (numErrors > errorLimit) {
            grunt.warn("Number of tslint errors (" + numErrors + ") exceeds limit (" + errorLimit + ")!");
        } else {
            grunt.log.writeln("Number of tslint errors (" + numErrors + ") is within than the limit (" + errorLimit + ").");
        }
    });
}

function configureGrunt(grunt) {
    grunt.initConfig({
        cfg: {
            'libName': 'datasci.js',
            'libNamespace': 'sci',
             
            'src': './src',
            'test': './test',
            'build': './build',
            'reports': './reports',
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
            },
            reports: {
                files: [{
                    dot: true,
                    src: '<%= cfg.reports %>/'
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
        },

        tslint: {
            all: {
                options: {
                    configuration: grunt.file.readJSON("tslint.json"),
                    outputFile: "<%= cfg.reports %>/tslint.txt",
                    formatter: "verbose",
                    appendToOutput: true
                },
                files: {
                    src: [
                        'src/**/*.ts',
                        '!src/typings/**/*'
                    ]
                }
            }
        },

        shell: {
            removeTrailingWhitespaces: {
                command: "find src/ -type f -name '*.ts' -exec sed --in-place 's/[[:space:]]\+$//' {} \+"
            }
        }
    });
}


/**
 * grunt entrypoint
 */
module.exports = function(grunt) {
    // load all plugins
    loadPlugins(grunt);

    // configure all plugins
    configureGrunt(grunt);

    // register tasks
    registerTasks(grunt);
};