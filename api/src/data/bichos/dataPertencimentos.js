const pool = require('../../config/database');

exports.getPertencimentos = function () {
	return pool.query(
		'SELECT * FROM pertencimentos'
	);
};

exports.getPertencimento = function (bichoId, comunidadeId) {
	return pool.query(
		'SELECT * FROM pertencimentos WHERE bicho_id = $1 AND comunidade_id = $2',
		[bichoId, comunidadeId]
	);
};

exports.getBichosNaComunidade = function (comunidadeId) {
	return pool.query(
		'SELECT * FROM pertencimentos WHERE comunidade_id = $1',
		[comunidadeId]
	);
};

exports.getComunidadesDoBicho = function (bichoId) {
	return pool.query(
		'SELECT * FROM pertencimentos WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.postPertencimento = function (bichoId, comunidadeId, habilidades) {
	return pool.query(
		'INSERT INTO pertencimentos (bicho_id, comunidade_id, participar, editar, moderar, representar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[bichoId, comunidadeId, habilidades.participar, habilidades.editar, habilidades.moderar, habilidades.representar]
	);
};

exports.putPertencimento = function (bichoId, comunidadeId, habilidades) {
	return pool.query(
		'UPDATE pertencimentos SET participar = $1, editar = $2, moderar = $3, representar = $4 WHERE bicho_id = $5 AND comunidade_id = $6 RETURNING *',
		[habilidades.participar, habilidades.editar, habilidades.moderar, habilidades.representar, bichoId, comunidadeId]
	);
};

exports.deletePertencimento = function (bichoId, comunidadeId) {
	return pool.query(
		'DELETE FROM pertencimentos WHERE bicho_id = $1 AND comunidade_id = $2',
		[bichoId, comunidadeId]
	);
};