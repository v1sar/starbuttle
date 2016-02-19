module.exports = function (grunt) {

    grunt.initConfig({

		shell: {
      dev: {
        command: 'node server.js'
      }
			// запуск сервера через скрипт shell'a https://www.npmjs.com/package/grunt-shell
		},

		watch: {
        fest: {
          files: ['templates/*.xml'],
          tasks: ['fest'],
          options: {
            spawn: 'false',
            atBegin: 'true',
          },
        }

			// запуск watcher'a, который следит за изенениями файлов  templates/*.xml
			// и если они изменяются, то запускает таск сборки шаблонов (grunt fest)
		},

		concurrent: {
      dev: ['shell', 'watch']
			// одновременный запуска shell'a и watcher'a https://www.npmjs.com/package/grunt-concurrent
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
