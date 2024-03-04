const pool = require('../../config/database');

exports.getComunidades = function () {
	return pool.query(
		'SELECT * FROM comunidades JOIN bichos ON comunidades.bicho_id = bichos.bicho_id'
	);
};

exports.getComunidade = function (bichoId) {
	return pool.query(
		'SELECT * FROM comunidades JOIN bichos ON comunidades.bicho_id = bichos.bicho_id WHERE bichos.bicho_id = $1',
		[bichoId]
	);
};

exports.postComunidade = function (bichoId, bichoCriadorId) {
	return pool.query(
		'INSERT INTO comunidades (bicho_id, bicho_criador_id) VALUES ($1, $2) RETURNING *',
		[bichoId, bichoCriadorId]
	);
};

exports.putComunidade = function (comunidade) {
	return pool.query(
		'UPDATE comunidades SET participacao_livre = $1, participacao_com_convite = $2 WHERE bicho_id = $3 RETURNING *',
		[comunidade.participacao_livre, comunidade.participacao_com_convite, comunidade.bicho_id]
	);
};