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