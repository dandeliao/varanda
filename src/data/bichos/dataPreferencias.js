const pool = require('../../config/database');

exports.getPreferencias = function (bichoId) {
	return pool.query(
		'SELECT * FROM preferencias WHERE bicho_id = $1',
		[bichoId]
	);
};

exports.postPreferencias = function (bichoId) {
	return pool.query(
		'INSERT INTO preferencias (bicho_id) VALUES ($1) RETURNING *',
		[bichoId]
	);
};

exports.putPreferencias = function (bichoId, preferencias) {
	return pool.query(
		'UPDATE preferencias SET tema = $1 WHERE bicho_id = $2 RETURNING *',
		[preferencias.tema, bichoId]
	);
};