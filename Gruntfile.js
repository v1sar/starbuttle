module.exports = function (grunt) {

    grunt.initConfig({

		shell: {
            // запуск сервера через скрипт shell'a https://www.npmjs.com/package/grunt-shell
            dev: {
                command: 'node server.js'     // node
            }
		},

		watch: {
            // запуск watcher'a, который следит за изенениями файлов  templates/*.xml
            // и если они изменяются, то запускает таск сборки шаблонов (grunt fest)
            fest: {
                files: ['templates/*.xml'],
                tasks: ['fest'],
                options: {
                    spawn: 'false',
                    atBegin: 'true',
                },
            }
		},

		concurrent: {
            // одновременный запуска shell'a и watcher'a https://www.npmjs.com/package/grunt-concurrent
            dev: ['shell', 'watch']
		},

		fest: {
            templates: {
                files: [{
                    expand: true,
                    cwd: 'templates',
                    src: '*.xml',
                    dest: 'public_html/js/tmpl'
                }],
                options: {
                    template: function (data) {
                        return grunt.template.process(
                            'var <%= name %>Tmpl = <%= contents %> ;',
                            {data: data}
                        );
                    }
                }
            }
        }

    });

	// подключть все необходимые модули
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-fest');

    // результат команды grunt
    grunt.registerTask('default', ['shell', 'watch']);
};
