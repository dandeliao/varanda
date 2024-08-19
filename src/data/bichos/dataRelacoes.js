const pool = require('../../config/database');

exports.getRelacao = function (bichoId, comunidadeId) {
	return pool.query(
		'SELECT * FROM relacoes WHERE bicho_id = $1 AND comunidade_id = $2',
		[bichoId, comunidadeId]
	);
};

exports.getBichosNaComunidade = function (comunidadeId) {
	return pool.query(
		'SELECT * FROM relacoes WHERE comunidade_id = $1',
		[comunidadeId]
	);
};

exports.getComunidadesDoBicho = function (bichoId) {
	return pool.query(
		'SELECT * FROM relacoes JOIN bichos ON relacoes.comunidade_id = bichos.bicho_id WHERE relacoes.bicho_id = $1',
		[bichoId]
	);
};

exports.getRepresentantes = function (comunidadeId) {
	return pool.query(
		'SELECT * FROM relacoes WHERE comunidade_id = $1 AND representar = true',
		[comunidadeId]
	);
};

exports.getModeradorus = function (comunidadeId) {
	return pool.query(
		'SELECT * FROM relacoes WHERE comunidade_id = $1 AND moderar = true',
		[comunidadeId]
	);
};

exports.getEditorus = function (comunidadeId) {
	return pool.query(
		'SELECT * FROM relacoes WHERE comunidade_id = $1 AND editar = true',
	[comunidadeId]
	);
};

exports.postRelacao = function (bichoId, comunidadeId, habilidades) {
	return pool.query(
		'INSERT INTO relacoes (bicho_id, comunidade_id, participar, editar, moderar, representar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[bichoId, comunidadeId, habilidades.participar, habilidades.editar, habilidades.moderar, habilidades.representar]
	);
};

exports.putRelacao = function (bichoId, comunidadeId, habilidades) {
	return pool.query(
		'UPDATE relacoes SET participar = $1, editar = $2, moderar = $3, representar = $4 WHERE bicho_id = $5 AND comunidade_id = $6 RETURNING *',
		[habilidades.participar, habilidades.editar, habilidades.moderar, habilidades.representar, bichoId, comunidadeId]
	);
};

exports.deleteRelacao = function (bichoId, comunidadeId) {
	return pool.query(
		'DELETE FROM relacoes WHERE bicho_id = $1 AND comunidade_id = $2',
		[bichoId, comunidadeId]
	);
};