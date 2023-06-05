const pool = require('../../config/database');

exports.getTagsArtefatos = function() {
	pool.query(
		'SELECT * FROM tags_artefatos'
	);
};

exports.getArtefatosComTag = function(tagId) {
	pool.query(
		'SELECT * FROM tags_artefatos WHERE tag_id = $1',
		[tagId]
	);
};

exports.getTagsDoArtefato = function(artefatoId) {
	pool.query(
		'SELECT * FROM tags_artefatos WHERE artefato_id = $1',
		[artefatoId]
	);
};

exports.postTagArtefato = function(tagId, artefatoId) {
	pool.query(
		'INSERT INTO tags_artefatos (tag_id, artefato_id) VALUES ($1, $2)',
		[tagId, artefatoId]
	);
};

exports.deleteTagArtefato = function(tagId, artefatoId) {
	pool.query(
		'DELETE FROM tags_artefatos WHERE tag_id = $1 AND artefato_id = $2',
		[tagId, artefatoId]
	);
};