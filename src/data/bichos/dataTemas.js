const pool = require('../../config/database');

exports.getTemas = function () {
	return pool.query(
		'SELECT * FROM temas'
	);
};

exports.getTema = function (temaId) {
	return pool.query(
		'SELECT * FROM temas WHERE tema_id = $1',
		[temaId]
	);
};

exports.postTema = function (nome, origem) {
	return pool.query(
		'INSERT INTO temas (nome, origem) VALUES ($1, $2) RETURNING *',
		[nome, origem]
	);
};

exports.deleteTema = function (temaId) {
	return pool.query(
		'DELETE FROM temas WHERE tema_id = $1',
		[temaId]
	);
};