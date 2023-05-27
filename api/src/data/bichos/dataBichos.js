const pool = require('../../config/database');

exports.getBichos = function () {
	return pool.query(
		'SELECT * FROM bichos'
	);
};

exports.getBicho = function (bichoId) {
	return pool.query(
		'SELECT * FROM bichos WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.postBicho = function (bicho) {
	return pool.query(
		'INSERT INTO bichos (bicho_id, nome, descricao) VALUES ($1, $2, $3) RETURNING *',
		[bicho.bicho_id, bicho.nome, bicho.descricao]
	);
};

exports.putBicho = function (bicho) {
	return pool.query(
		'UPDATE bichos SET nome = $1, descricao = $2, avatar = $3, descricao_avatar = $4, fundo = $5, descricao_fundo = $6, WHERE bicho_id = $7 RETURNING *',
		[bicho.nome, bicho.descricao, bicho.avatar, bicho.descricao_avatar, bicho.fundo, bicho.descricao_fundo, bicho.bicho_id]
	);
};

exports.deleteBicho = function (bichoId) {
	return pool.query(
		'DELETE FROM bichos WHERE bicho_id = $1',
		[bichoId]
	);
};