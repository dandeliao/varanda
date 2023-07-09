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
		'INSERT INTO comunidades (bicho_id, nome, descricao, bicho_criador_id) VALUES ($1, $2, $3) RETURNING *',
		[bicho.bicho_id, bicho.nome, bicho.descricao]
	);
};

exports.putComunidade = function (comunidade) {
	return pool.query(
		'UPDATE comunidades SET participacao_livre = $1, participacao_com_convite = $2, periodo_geracao_convite = $3 WHERE bicho_id = $4 RETURNING *',
		[comunidade.participacao_livre, comunidade.participacao_com_convite, comunidade.periodo_geracao_convite, comunidade.bicho_id]
	);
};

exports.deleteComunidade = function (bichoId) {
	return pool.query(
		'DELETE FROM comunidades WHERE bicho_id = $1',
		[bichoId]
	);
};