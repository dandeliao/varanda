const pool = require('../../config/database');

exports.getRecuperacao = function (bicho_id) {
	return pool.query(
		'SELECT * FROM recuperacoes WHERE bicho_id = $1',
		[bicho_id]
	);
};

exports.postRecuperacao = function (bichoId) {
	return pool.query(
		'INSERT INTO recuperacoes (bicho_id) VALUES ($1) RETURNING *',
		[bichoId]
	);
};

exports.deleteRecuperacao = function (recuperacaoId) {
	return pool.query(
		'DELETE FROM recuperacoes WHERE recuperacao_id = $1',
		[recuperacaoId]
	);
};