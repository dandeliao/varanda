const pool = require('../../config/database');

exports.getPessoas = function () {
	return pool.query(
		'SELECT bichos.bicho_id, nome, descricao, avatar, descricao_avatar, fundo, descricao_fundo FROM bichos JOIN pessoas ON bichos.bicho_id = pessoas.bicho_id'
	);
};

exports.getPessoa = function (bichoId) {
	return pool.query(
		'SELECT bichos.bicho_id, nome, descricao, avatar, descricao_avatar, fundo, descricao_fundo FROM bichos JOIN pessoas ON bichos.bicho_id = pessoas.bicho_id WHERE bichos.bicho_id = $1',
		[bichoId]
	);
};

exports.getEmail = function (bichoId) {
	return pool.query(
		'SELECT email FROM pessoas WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.getHashSalt = function (bichoId) {
	return pool.query(
		'SELECT hash, salt FROM pessoas WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.postPessoa = function (bichoId, segredos) {
	return pool.query(
		'INSERT INTO pessoas (bicho_id, email, hash, salt) VALUES ($1, $2, $3, $4) RETURNING bicho_id',
		[bichoId, segredos.email, segredos.hash, segredos.salt]
	);
};

exports.putPessoa = function (bichoId, segredos) {
	return pool.query(
		'UPDATE pessoas SET email = $1, hash = $2, salt = $3 WHERE bicho_id = $4 RETURNING bicho_id, email',
		[segredos.email, segredos.hash, segredos.salt, bichoId]
	);
};