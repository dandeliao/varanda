const pool = require('../../config/database');

exports.getVarandas = function (comunitaria, aberta) {
	let resultado;
	if (comunitaria && aberta) {
		resultado = pool.query(
			'SELECT * FROM varandas WHERE comunitaria = $1 AND aberta = $2',
			[comunitaria, aberta]
		);
	} else if (comunitaria) {
		resultado = pool.query(
			'SELECT * FROM varandas WHERE comunitaria = $1',
			[comunitaria]		
		);
	} else if (aberta) {
		resultado = pool.query(
			'SELECT * FROM varandas WHERE aberta = $1',
			[aberta]		
		);
	} else {
		resultado = pool.query(
			'SELECT * FROM varandas'
		);
	}
	return resultado;
};

exports.getVarandaDoBicho = function (bichoId) {
	return pool.query(
		'SELECT * FROM varandas WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.getVaranda = function (varandaId) {
	return pool.query(
		'SELECT * FROM varandas WHERE varanda_id = $1',
		[varandaId]
	);
};

exports.createVaranda = function (bichoId, comunitaria) {
	return pool.query(
		'INSERT INTO varandas (bicho_id, comunitaria) VALUES ($1, $2) RETURNING *',
		[bichoId, comunitaria]
	);
};

exports.editVaranda = function (varandaId, aberta){
	return pool.query(
		'UPDATE varandas SET aberta = $1 WHERE varanda_id = $2 RETURNING *',
		[aberta, varandaId]	
	);
};