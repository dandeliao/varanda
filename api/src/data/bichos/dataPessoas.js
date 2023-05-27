const pool = require('../../config/database');

exports.getPessoas = function () {
	return pool.query(
		'SELECT bicho_id, nome, descricao, avatar, descricao_avatar, fundo, descricao_fundo FROM pessoas'
	);
};

exports.getPessoa = function (bichoId) {
	return pool.query(
		'SELECT bicho_id, nome, descricao, avatar, descricao_avatar, fundo, descricao_fundo FROM pessoas WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.getEmail = function (bichoId) {
	return pool.query(
		'SELECT email FROM pessoas WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.postPessoa = function (bicho, segredos) {
	return pool.query(
		'INSERT INTO pessoas (bicho_id, nome, descricao, email, hash, salt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING bicho_id',
		[bicho.bicho_id, bicho.nome, bicho.descricao, segredos.email, segredos.hash, segredos.salt]
	);
};

exports.putPessoa = function (bicho) {
	return pool.query(
		'UPDATE pessoas SET nome = $1, descricao = $2, avatar = $3, descricao_avatar = $4, fundo = $5, descricao_fundo = $6 WHERE bicho_id = $7 RETURNING bicho_id, nome, descricao, avatar, descricao_avatar, fundo, descricao_fundo',
		[bicho.nome, bicho.descricao, bicho.avatar, bicho.descricao_avatar, bicho.fundo, bicho.descricao_fundo, bicho.bicho_id]
	);
};

exports.putSegredos = function (bichoId, segredos) {
	return pool.query(
		'UPDATE pessoas SET email = $1, hash = $2, salt = $3, WHERE bicho_id = $4 RETURNING bicho_id',
		[segredos.email, segredos.hash, segredos.salt, bichoId]
	);
};