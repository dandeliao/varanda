const pool = require('../config/database');

function getPessoas() {
	return pool.query(
		'SELECT * FROM pessoas'
	);
}

function getPessoa(pessoaId) {
	return pool.query(
		'SELECT * FROM pessoas WHERE pessoa_id = $1',
		[pessoaId]
	);
}

function postPessoa(pessoa) {
	return pool.query(
		'INSERT INTO pessoas (pessoa_id, nome, descricao) VALUES ($1, $2, $3) RETURNING *',
		[pessoa.pessoa_id, pessoa.nome, pessoa.descricao]
	);
}

function putPessoa(pessoaId, pessoa) {
	return pool.query(
		'UPDATE pessoas SET pessoa_id = $1, nome = $2, descricao = $3 WHERE pessoa_id = $4 RETURNING *',
		[pessoa.pessoa_id, pessoa.nome, pessoa.descricao, pessoaId]
	);
}

function deletePessoa(pessoaId) {
	return pool.query(
		'DELETE FROM pessoas WHERE pessoa_id = $1',
		[pessoaId]
	);
}

exports.getPessoas = getPessoas;
exports.postPessoa = postPessoa;
exports.deletePessoa = deletePessoa;
exports.getPessoa = getPessoa;
exports.putPessoa = putPessoa;