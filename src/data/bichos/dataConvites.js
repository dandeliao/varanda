const pool = require('../../config/database');

exports.getConvites = function () {
	return pool.query(
		'SELECT * FROM convites'
	);
};

exports.getConvite = function (conviteId) {
	return pool.query(
		'SELECT * FROM convites WHERE convite_id = $1',
		[conviteId]
	);
};

exports.getConvitesParaComunidade = function (comunidadeId) {
	return pool.query(
		'SELECT * FROM convites WHERE comunidade_id = $1',
		[comunidadeId]
	);
};

exports.getConvitesDoBicho = function (bichoId) {
	return pool.query(
		'SELECT * FROM convites WHERE bicho_criador_id = $1',
		[bichoId]
	);
};

exports.postConvite = function (bichoId, comunidadeId) {
	return pool.query(
		'INSERT INTO convites (bicho_criador_id, comunidade_id) VALUES ($1, $2) RETURNING *',
		[bichoId, comunidadeId]
	);
};

exports.deleteConvite = function (conviteId) {
	return pool.query(
		'DELETE FROM convites WHERE convite_id = $1',
		[conviteId]
	);
};