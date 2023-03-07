const pool = require('../../../config/database');

function getPessoasComunidade(comunidadeId) {
	return pool.query(
		'SELECT * FROM pessoas_comunidades WHERE comunidade_id = $1',
		[comunidadeId]
	);
}

function getPessoaComunidades(pessoaId) {
	return pool.query(
		'SELECT * FROM pessoas_comunidades WHERE pessoa_id = $1',
		[pessoaId]
	);
}

function getPessoaComunidade(pessoaId, comunidadeId) {
	return pool.query(
		'SELECT * FROM pessoas_comunidades WHERE pessoa_id = $1 AND comunidade_id = $2',
		[pessoaId, comunidadeId]
	);
}

function postPessoaComunidade(pessoaId, comunidadeId, habilidades) {
	return pool.query(
		'INSERT INTO pessoas_comunidades (pessoa_id, comunidade_id, participar, editar, moderar, cuidar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[pessoaId, comunidadeId, habilidades.participar, habilidades.editar, habilidades.moderar, habilidades.cuidar]
	);
}

function putPessoaComunidade(pessoaId, comunidadeId, habilidades) {
	return pool.query(
		'UPDATE pessoas_comunidades SET participar = $1, editar = $2, moderar = $3, cuidar = $4 WHERE pessoa_id = $5 AND comunidade_id = $6 RETURNING *',
		[habilidades.participar, habilidades.editar, habilidades.moderar, habilidades.cuidar, pessoaId, comunidadeId]
	);
}

function deletePessoaComunidade(pessoaId, comunidadeId) {
	return pool.query(
		'DELETE FROM pessoas_comunidades WHERE pessoa_id = $1 AND comunidade_id = $2',
		[pessoaId, comunidadeId]
	);
}

exports.getPessoasComunidade = getPessoasComunidade;
exports.getPessoaComunidades = getPessoaComunidades;
exports.getPessoaComunidade = getPessoaComunidade;
exports.postPessoaComunidade = postPessoaComunidade;
exports.deletePessoaComunidade = deletePessoaComunidade;
exports.putPessoaComunidade = putPessoaComunidade;