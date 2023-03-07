const pool = require('../config/database');

function getComunidades() {
	return pool.query(
		'SELECT * FROM comunidades'
	);
}

function getComunidade(comunidadeId) {
	return pool.query(
		'SELECT * FROM comunidades WHERE comunidade_id = $1',
		[comunidadeId]
	);
}

function postComunidade(comunidade) {
	return pool.query(
		'INSERT INTO comunidades (comunidade_id, nome, descricao) VALUES ($1, $2, $3) RETURNING *',
		[comunidade.comunidade_id, comunidade.nome, comunidade.descricao]
	);
}

function putComunidade(comunidade) {
	return pool.query(
		'UPDATE comunidades SET nome = $1, descricao = $2 aberta = $3 WHERE comunidade_id = $4 RETURNING *',
		[comunidade.nome, comunidade.descricao, comunidade.aberta, comunidade.comunidade_id]
	);
}

function deleteComunidade(comunidadeId) {
	return pool.query(
		'DELETE FROM comunidades WHERE comunidade_id = $1',
		[comunidadeId]
	);
}

exports.getComunidades = getComunidades;
exports.getComunidade = getComunidade;
exports.postComunidade = postComunidade;
exports.deleteComunidade = deleteComunidade;
exports.putComunidade = putComunidade;