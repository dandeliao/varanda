const pool = require('../../config/database');

exports.getTags = function() {
	pool.query(
		'SELECT * FROM tags'
	);
};

exports.getTag = function(tagId) {
	pool.query(
		'SELECT * FROM tags WHERE tag_id = $1',
		[tagId]
	);
};

exports.postTag = function(tagId) {
	pool.query(
		'INSERT INTO tags (tag_id) VALUES ($1)',
		[tagId]
	);
};

exports.deleteTag = function(tagId) {
	pool.query(
		'DELETE FROM tags WHERE tag_id = $1',
		[tagId]
	);
};