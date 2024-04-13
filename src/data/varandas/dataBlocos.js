const pool = require('../../config/database');

exports.getBlocos = function (comunitario) {
	let resultado;
	if (comunitario !== null) {
		resultado = pool.query(
			'SELECT * FROM blocos WHERE comunitario = $1',
			[comunitario]
		);
	} else {
		resultado = pool.query('SELECT * FROM blocos');
	}
	return resultado;
};

exports.getBloco = function (blocoId) {
	return pool.query(
		'SELECT * FROM blocos WHERE bloco_id = $1',
		[blocoId]
	);
};

exports.postBloco = function (blocoId, descricao, comunitario, variaveis) {
	return pool.query(
		'INSERT INTO blocos (bloco_id, descricao, comunitario, variaveis) VALUES ($1, $2, $3, $4) RETURNING *',
		[blocoId, descricao, comunitario, variaveis]
	);
};