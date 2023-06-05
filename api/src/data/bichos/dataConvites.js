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
		'SELECT * FROM convites WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.postConvite = function (bichoId, comunidadeId, codigo) {
	return pool.query(
		'INSERT INTO convites (bicho_id, comunidade_id, codigo) VALUES ($1, $2, $3) RETURNING *',
		[bichoId, comunidadeId, codigo]
	);
};

exports.deleteConvite = function (conviteId) {
	return pool.query(
		'DELETE FROM convites WHERE convite_id = $1',
		[conviteId]
	);
};