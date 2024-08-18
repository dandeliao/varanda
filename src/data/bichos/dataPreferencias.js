const pool = require('../../config/database');

exports.getPreferencias = function (bichoId) {
	return pool.query(
		'SELECT * FROM preferencias JOIN temas ON preferencias.tema_id = temas.tema_id WHERE preferencias.bicho_id = $1',
		[bichoId]
	);
};

exports.postPreferencias = function (bichoId, preferencias) {
	return pool.query(
		'INSERT INTO preferencias (bicho_id, tema_id) VALUES ($1, $2) RETURNING *',
		[bichoId, preferencias.tema_id]
	);
};

exports.putPreferencias = function (bichoId, preferencias) {
	return pool.query(
		'UPDATE preferencias SET tema_id = $1 WHERE bicho_id = $2 RETURNING *',
		[preferencias.tema_id, bichoId]
	);
};