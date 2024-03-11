const pool = require('../../config/database');

exports.getTagsEmUso = function() {
	pool.query(
		'SELECT * FROM tags_em_uso'
	);
};

exports.getArtefatosComTag = function(tagId) {
	pool.query(
		'SELECT * FROM tags_em_uso WHERE tag_id = $1',
		[tagId]
	);
};

exports.getTagsDoArtefato = function(artefatoId) {
	pool.query(
		'SELECT * FROM tags_em_uso WHERE artefato_id = $1',
		[artefatoId]
	);
};

exports.getTagsDoBicho = function(bichoId) {
	pool.query(
		'SELECT * FROM tags_em_uso WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.postTagArtefato = function(tagId, artefatoId, bichoId) {
	pool.query(
		'INSERT INTO tags_tags_em_uso (tag_id, artefato_id, bichoId) VALUES ($1, $2, $3)',
		[tagId, artefatoId, bichoId]
	);
};

exports.deleteTagArtefato = function(tagId, artefatoId, bichoId) {
	pool.query(
		'DELETE FROM tags_em_uso WHERE tag_id = $1 AND artefato_id = $2 AND bicho_id = $3',
		[tagId, artefatoId, bichoId]
	);
};