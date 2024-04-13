const pool = require('../../config/database');

exports.getBichosPadrao = function () {
	return pool.query(
		'SELECT * FROM bichos_padrao'
	);
};

exports.getBichoPadrao = function (bichoPadraoId) {
	return pool.query(
		'SELECT * FROM bichos_padrao WHERE bicho_padrao_id = $1',
		[bichoPadraoId]
	);
};

exports.postBichoPadrao = function (avatar, descricao_avatar, fundo, descricao_fundo) {
	return pool.query(
		'INSERT INTO bichos_padrao (avatar, descricao_avatar, fundo, descricao_fundo) VALUES ($1, $2, $3, $4) RETURNING *',
		[avatar, descricao_avatar, fundo, descricao_fundo]
	)
};