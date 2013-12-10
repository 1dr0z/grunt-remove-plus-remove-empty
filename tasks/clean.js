'use strict';

var path = require('path'),
    fs   = require('fs');

module.exports = function(grunt) {
	// Remove a single filepath (recursively)
	function remove(filepath, options) {
		if (grunt.file.exists(filepath) && grunt.file.delete(filepath, options)) {
			grunt.log.write((options['no-write'] ? 'Would remove ' : 'Removed ') + filepath + ' ... ');
			grunt.log.ok();
			return true;
		}
		return false;
	}

	grunt.registerMultiTask('clean', 'Clean files and folders.', function() {
		var options = this.options({
			'force' : !!grunt.option('force'),
			'no-write' : !!grunt.option('no-write'),
			'delete-empty-folders': !!grunt.option('delete-empty-folders')
		});

		// Attempt removal of all specified files
		this.filesSrc.forEach(function(filepath) {
			if (remove(filepath, options) && options['delete-empty-folders']) {
				filepath = path.dirname(filepath);
				while (!fs.readdirSync(filepath).length) {
					remove(filepath, options);
					filepath = path.dirname(filepath);
				}
			}
		});
	});
};