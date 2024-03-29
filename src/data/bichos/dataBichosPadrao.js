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