const pool = require('../../config/database');

exports.getVarandas = function () {
	return pool.query(
		'SELECT * FROM varandas'
	);
};

exports.getVaranda = function (varandaId) {
	return pool.query(
		'SELECT * FROM varandas WHERE varanda_id = $1',
		[varandaId]
	);
};

exports.getVarandaDoBicho = function (bichoId) {
	return pool.query(
		'SELECT * FROM varandas WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.createVaranda = function (bichoId, comunitaria) {
	return pool.query(
		'INSERT INTO varandas (bicho_id, comunitaria) VALUES ($1, $2) RETURNING *',
		[bichoId, comunitaria]
	);
};

exports.editVaranda = function (comunitaria){
	return pool.query(
		'UPDATE varandas SET comunitaria = $1 WHERE varanda_id = $2 RETURNING *',
		[comunitaria]	
	);
};