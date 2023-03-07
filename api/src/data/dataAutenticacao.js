const pool = require('../config/database');

function postSegredos(pessoa_id, segredos) {
	return pool.query(
		'INSERT INTO autenticacao (pessoa_id, email, hash, salt) VALUES ($1, $2, $3, $4) RETURNING pessoa_id',
		[pessoa_id, segredos.email, segredos.hash, segredos.salt]
	);
}

function deleteSegredos(pessoa_id) {
	return pool.query(
		'DELETE FROM autenticacao WHERE pessoa_id = $1',
		[pessoa_id]
	);
}

exports.postSegredos = postSegredos;
exports.deleteSegredos = deleteSegredos;