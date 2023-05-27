const pool = require('../../config/database');

exports.getComunidades = function () {
	return pool.query(
		'SELECT * FROM comunidades'
	);
};

exports.getComunidade = function (bichoId) {
	return pool.query(
		'SELECT * FROM comunidades WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.postComunidade = function (bicho) {
	return pool.query(
		'INSERT INTO comunidades (bicho_id, nome, descricao) VALUES ($1, $2, $3) RETURNING *',
		[bicho.bicho_id, bicho.nome, bicho.descricao]
	);
};

exports.putComunidade = function (comunidade) {
	return pool.query(
		'UPDATE comunidades SET nome = $1, descricao = $2, avatar = $3, descricao_avatar = $4, fundo = $5, descricao_fundo = $6, livre_entrada = $7, periodo_geracao_convite = $8 WHERE bicho_id = $9 RETURNING *',
		[comunidade.nome, comunidade.descricao, comunidade.avatar, comunidade.descricao_avatar, comunidade.fundo, comunidade.descricao_fundo, comunidade.livre_entrada, comunidade.periodo_geracao_convite, comunidade.bicho_id]
	);
};

exports.deleteComunidade = function (bichoId) {
	return pool.query(
		'DELETE FROM comunidades WHERE bicho_id = $1',
		[bichoId]
	);
};