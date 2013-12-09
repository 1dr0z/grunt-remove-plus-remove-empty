'use strict';

var path = require('path'),
    fs   = require('fs');

module.exports = function(grunt) {

	// Remove a single filepath
	function removeSingle(filepath, options) {
		if (grunt.file.exists(filepath) && // path exists
		    !grunt.file.isDir(filepath) || // is file
		    (options['delete-empty-folders'] && !fs.readdirSync(filepath).length) // is empty folder
		) { return grunt.file.delete(filepath, options); }
		return false;
	}

	// Remove up the directory tree as far as possible
	function removeBubble(filepath, options) {
		while (removeSingle(filepath, options)) {
			grunt.log.write((options['no-write'] ? 'Would remove ' : 'Removed ') + filepath + ' ... ');
			grunt.log.ok();

			filepath = path.dirname(filepath);
		}
	}

	grunt.registerMultiTask('clean', 'Clean files and folders.', function() {
		var options = this.options({
			'force' : !!grunt.option('force'),
			'no-write' : !!grunt.option('no-write'),
			'delete-empty-folders': !!grunt.option('delete-empty-folders')
		});

		// Attempt removal of all specified files
		this.filesSrc.forEach(function(filepath) {
			if (grunt.file.isDir(filepath)) {
				grunt.file.recurse(filepath, function(filepath) {
					removeBubble(filepath, options);
				});
			} else {
				removeBubble(filepath, options);
			}
		});
	});
};